import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    deadline: { type: Date, default: null },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  },
  { timestamps: true }
);

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

const tasks = [
  {
    title: 'Fix Login Bug',
    description: 'Users getting logged out after 10 mins. Check JWT expiry.',
    deadline: new Date('2026-04-22'),
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'New Landing Page',
    description: 'Wireframes and mockups for the redesigned marketing page.',
    deadline: new Date('2026-05-01'),
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'Write API Tests',
    description: 'Cover all /api/tasks endpoints with Jest including edge cases.',
    deadline: new Date('2026-05-10'),
    status: 'Pending',
    priority: 'Medium',
  },
  {
    title: 'Update README',
    description: 'Add setup guide, env vars, and deployment steps.',
    deadline: new Date('2026-04-30'),
    status: 'Completed',
    priority: 'Low',
  },
  {
    title: 'Atlas Migration',
    description: 'Move local MongoDB to Atlas and update connection strings.',
    deadline: new Date('2026-04-25'),
    status: 'Completed',
    priority: 'High',
  },
  {
    title: 'Dark Mode',
    description: 'Theme toggle that saves preference in localStorage.',
    deadline: new Date('2026-05-15'),
    status: 'Pending',
    priority: 'Medium',
  },
  {
    title: 'Compress Images',
    description: 'Convert all PNGs to WebP to improve load speed.',
    deadline: new Date('2026-05-05'),
    status: 'Pending',
    priority: 'Low',
  },
  {
    title: 'CI/CD Pipeline',
    description: 'GitHub Actions to lint, test, and deploy on push to main.',
    deadline: new Date('2026-05-20'),
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'User Interviews',
    description: 'Run 5 interviews to gather UX feedback from real users.',
    deadline: new Date('2026-04-28'),
    status: 'Pending',
    priority: 'Medium',
  },
  {
    title: 'Refactor Context',
    description: 'Split TaskContext into smaller hooks, reduce re-renders.',
    deadline: new Date('2026-05-12'),
    status: 'Completed',
    priority: 'Low',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const inserted = await Task.insertMany(tasks);
    console.log(`✅ Inserted ${inserted.length} tasks:`);
    inserted.forEach((t, i) => console.log(`  ${i + 1}. [${t.priority}] ${t.title}`));
  } catch (err) {
    console.error('❌ Error seeding tasks:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
