import connectDB from '../../lib/mongodb.js';
import Task from '../../lib/Task.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await connectDB();

    // GET /api/tasks — return all tasks, newest first
    if (req.method === 'GET') {
      const rawTasks = await Task.find({}).sort({ createdAt: -1 }).lean();
      const tasks = rawTasks.map(t => ({ ...t, priority: t.priority || 'Medium' }));
      return res.status(200).json(tasks);
    }

    // POST /api/tasks — create new task
    if (req.method === 'POST') {
      const { title, description, deadline, status, priority } = req.body;

      if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
      }

      const task = await Task.create({
        title: title.trim(),
        description: description?.trim() || '',
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'Pending',
        priority: priority || 'Medium',
      });

      return res.status(201).json(task);
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('API /tasks error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
