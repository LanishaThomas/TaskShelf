// TaskShelf — Task Manager Types

export type TaskStatus = 'Pending' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type FilterType = 'all' | 'pending' | 'completed';
export type SortBy = 'createdAt' | 'deadline' | 'priority' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  by: SortBy;
  order: SortOrder;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  deadline: string | null; // ISO date string from MongoDB
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

export interface EncouragementMessage {
  id: string;
  message: string;
  type: 'welcome' | 'new-task' | 'complete' | 'delete' | 'reminder';
}

export const ENCOURAGEMENT_MESSAGES: EncouragementMessage[] = [
  { id: '1', message: 'New task added! Let\'s get it done! 🚀', type: 'new-task' },
  { id: '2', message: 'Another item on your list! You\'ve got this. ✨', type: 'new-task' },
  { id: '3', message: 'Task created — stay focused! 🎯', type: 'new-task' },
  { id: '4', message: 'Nailed it! Task marked complete! ✅', type: 'complete' },
  { id: '5', message: 'Crushed it! Great work! 🏆', type: 'complete' },
  { id: '6', message: 'One step closer to your goals! 💪', type: 'complete' },
  { id: '7', message: 'Momentum is building! Keep going! 🔥', type: 'complete' },
  { id: '8', message: 'Task removed. Keeping things clean! 🧹', type: 'delete' },
  { id: '9', message: 'Welcome back! Ready to be productive? ☕', type: 'welcome' },
  { id: '10', message: 'Your tasks are waiting. Let\'s go! 📋', type: 'welcome' },
  { id: '11', message: 'Don\'t forget to check your pending tasks! ⏰', type: 'reminder' },
  { id: '12', message: 'Small progress is still progress! 🌟', type: 'reminder' },
];

// Priority sort weight: High=0, Medium=1, Low=2
export const PRIORITY_WEIGHT: Record<string, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
  high: 0,
  medium: 1,
  low: 2,
};
