import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Task, FilterType, EncouragementMessage } from '@/types';
import { ENCOURAGEMENT_MESSAGES } from '@/types';

const API_BASE = '/api/tasks';

interface TaskState {
  tasks: Task[];
  filter: FilterType;
  selectedTaskId: string | null;
  showEncouragement: boolean;
  currentEncouragement: EncouragementMessage | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SELECT_TASK'; payload: string | null }
  | { type: 'SHOW_ENCOURAGEMENT'; payload: EncouragementMessage }
  | { type: 'HIDE_ENCOURAGEMENT' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  selectedTaskId: null,
  showEncouragement: false,
  currentEncouragement: null,
  searchQuery: '',
  loading: false,
  error: null,
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
        selectedTaskId: state.selectedTaskId === action.payload ? null : state.selectedTaskId,
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload, selectedTaskId: null };
    case 'SELECT_TASK':
      return { ...state, selectedTaskId: action.payload };
    case 'SHOW_ENCOURAGEMENT':
      return { ...state, showEncouragement: true, currentEncouragement: action.payload };
    case 'HIDE_ENCOURAGEMENT':
      return { ...state, showEncouragement: false };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

interface TaskContextType {
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  createTask: (data: { title: string; description: string; deadline: string; status: 'Pending' | 'Completed'; priority: 'High' | 'Medium' | 'Low' }) => Promise<void>;
  updateTask: (id: string, data: Partial<Pick<Task, 'title' | 'description' | 'deadline' | 'status' | 'priority'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleStatus: (task: Task) => Promise<void>;
  showEncouragementForAction: (type: EncouragementMessage['type']) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // ── Encouragement helper ──────────────────────────────────────────────
  const showEncouragementForAction = useCallback((type: EncouragementMessage['type']) => {
    const messages = ENCOURAGEMENT_MESSAGES.filter((m) => m.type === type);
    if (messages.length > 0) {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      dispatch({ type: 'SHOW_ENCOURAGEMENT', payload: msg });
      setTimeout(() => dispatch({ type: 'HIDE_ENCOURAGEMENT' }), 4000);
    }
  }, []);

  // ── Fetch all tasks on mount ──────────────────────────────────────────
  useEffect(() => {
    const fetchTasks = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) {
          let msg = `Server error (${res.status})`;
          try {
            const body = await res.json();
            msg = body.error || body.details || msg;
          } catch { /* ignore parse errors */ }
          throw new Error(msg);
        }
        const tasks: Task[] = await res.json();
        dispatch({ type: 'SET_TASKS', payload: tasks });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to connect to server';
        dispatch({ type: 'SET_ERROR', payload: message });
        console.error('Fetch tasks error:', err);
      }
    };
    fetchTasks();

    // Welcome encouragement
    const hasVisited = sessionStorage.getItem('taskshelf-visited');
    if (!hasVisited) {
      setTimeout(() => showEncouragementForAction('welcome'), 1200);
      sessionStorage.setItem('taskshelf-visited', 'true');
    }
  }, [showEncouragementForAction]);

  // ── CRUD operations ───────────────────────────────────────────────────
  const createTask = useCallback(async (data: {
    title: string;
    description: string;
    deadline: string;
    status: 'Pending' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
  }) => {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create task');
    }
    const task: Task = await res.json();
    dispatch({ type: 'ADD_TASK', payload: task });
    showEncouragementForAction('new-task');
  }, [showEncouragementForAction]);

  const updateTask = useCallback(async (id: string, data: Partial<Pick<Task, 'title' | 'description' | 'deadline' | 'status' | 'priority'>>) => {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update task');
    }
    const task: Task = await res.json();
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete task');
    }
    dispatch({ type: 'DELETE_TASK', payload: id });
    showEncouragementForAction('delete');
  }, [showEncouragementForAction]);

  const toggleStatus = useCallback(async (task: Task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    await updateTask(task._id, { status: newStatus });
    if (newStatus === 'Completed') {
      showEncouragementForAction('complete');
    }
  }, [updateTask, showEncouragementForAction]);

  return (
    <TaskContext.Provider value={{ state, dispatch, createTask, updateTask, deleteTask, toggleStatus, showEncouragementForAction }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}
