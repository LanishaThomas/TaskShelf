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
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the redesigned marketing landing page.',
    deadline: new Date('2026-05-01'),
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'Fix authentication bug',
    description: 'Users are getting logged out unexpectedly after 10 minutes. Investigate JWT expiry logic.',
    deadline: new Date('2026-04-22'),
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'Write unit tests for API',
    description: 'Cover all endpoints in /api/tasks with Jest tests including edge cases.',
    deadline: new Date('2026-05-10'),
    status: 'Pending',
    priority: 'Medium',
  },
  {
    title: 'Update project README',
    description: 'Add setup instructions, environment variables guide, and deployment steps.',
    deadline: new Date('2026-04-30'),
    status: 'Completed',
    priority: 'Low',
  },
  {
    title: 'Migrate database to Atlas',
    description: 'Move local MongoDB instance to MongoDB Atlas and update connection strings.',
    deadline: new Date('2026-04-25'),
    status: 'Completed',
    priority: 'High',
  },
  {
    title: 'Implement dark mode',
    description: 'Add a theme toggle that persists user preference in localStorage.',
    deadline: new Date('2026-05-15'),
    status: 'Pending',
    priority: 'Medium',
  },
  {
    title: 'Optimize image assets',
    description: 'Compress and convert all PNG images to WebP format to improve load times.',
    deadline: new Date('2026-05-05'),
    status: 'Pending',
    priority: 'Low',
  },
  {
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions to run lint, tests, and deploy to Vercel on push to main.',
    deadline: new Date('2026-05-20'),
    status: 'Pending',
    priority: 'High',
  },
  {
    title: 'Conduct user interviews',
    description: 'Schedule and run 5 user interviews to gather feedback on the current UX.',
    deadline: new Date('2026-04-28'),
    status: 'Pending',
    priority: 'Medium',
  },
  {
    title: 'Refactor task context',
    description: 'Split TaskContext into smaller hooks and reduce unnecessary re-renders.',
    deadline: new Date('2026-05-12'),
    status: 'Pending',
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
