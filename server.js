/**
 * Local Development Server
 * Use this for local testing: node server.js
 * Then in /app run: npm run dev
 * 
 * For Vercel production, use the /api/ serverless functions instead.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './lib/mongodb.js';
import Task from './lib/Task.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// GET /api/tasks
app.get('/api/tasks', async (req, res) => {
  try {
    await connectDB();
    const rawTasks = await Task.find({}).sort({ createdAt: -1 }).lean();
    const tasks = rawTasks.map(t => ({ ...t, priority: t.priority || 'Medium' }));
    res.json(tasks);
  } catch (err) {
    console.error('\n❌ GET /api/tasks failed:', err.message);
    res.status(500).json({ error: err.message, hint: 'Check MongoDB Atlas Network Access — make sure your IP is whitelisted.' });
  }
});

// POST /api/tasks
app.post('/api/tasks', async (req, res) => {
  try {
    await connectDB();
    const { title, description, deadline, status, priority } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' });
    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      deadline: deadline ? new Date(deadline) : null,
      status: status || 'Pending',
      priority: priority || 'Medium',
    });
    res.status(201).json(task);
  } catch (err) {
    console.error('\n❌ POST /api/tasks failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
app.put('/api/tasks/:id', async (req, res) => {
  try {
    await connectDB();
    const { title, description, deadline, status, priority } = req.body;
    const update = {};
    if (title !== undefined) update.title = title.trim();
    if (description !== undefined) update.description = description.trim();
    if (deadline !== undefined) update.deadline = deadline ? new Date(deadline) : null;
    if (status !== undefined) update.status = status;
    if (priority !== undefined) update.priority = priority;
    const task = await Task.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await connectDB();
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 TaskShelf API running on http://localhost:${PORT}`);
  console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ ' + process.env.MONGODB_URI.replace(/:([^@]+)@/, ':***@') : '❌ NOT SET — check your .env file'}`);
  console.log('   Connecting to MongoDB Atlas...');
  connectDB()
    .then(() => console.log('   MongoDB Atlas ✅ Connected!'))
    .catch((err) => console.error('   MongoDB Atlas ❌ Failed:', err.message, '\n   → Go to Atlas > Network Access and allow your IP (0.0.0.0/0 for all IPs)'));
});
