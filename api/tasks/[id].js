import connectDB from '../../lib/mongodb.js';
import Task from '../../lib/Task.js';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Task ID is required' });
  }

  try {
    await connectDB();

    // PUT /api/tasks/:id — update task
    if (req.method === 'PUT') {
      const { title, description, deadline, status, priority } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
      if (status !== undefined) {
        if (!['Pending', 'Completed'].includes(status)) {
          return res.status(400).json({ error: 'Status must be Pending or Completed' });
        }
        updateData.status = status;
      }
      if (priority !== undefined) {
        if (!['High', 'Medium', 'Low'].includes(priority)) {
          return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
        }
        updateData.priority = priority;
      }

      const task = await Task.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json(task);
    }

    // DELETE /api/tasks/:id — remove task
    if (req.method === 'DELETE') {
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json({ message: 'Task deleted successfully', id });
    }

    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(`API /tasks/${id} error:`, error);
    // Handle invalid MongoDB ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
