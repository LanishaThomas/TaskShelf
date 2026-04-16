import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TaskProvider, useTask } from '@/store/TaskContext';
import { TaskNav } from '@/components/TaskNav';
import { TaskShelf } from '@/components/TaskShelf';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskModal } from '@/components/AddTaskModal';
import { EncouragementToast } from '@/components/EncouragementToast';
import { DustParticles } from '@/components/DustParticles';
import type { Task } from '@/types';
import './App.css';

function TaskContent() {
  const { state, dispatch } = useTask();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks by the active tab
  const filteredTasks = state.tasks.filter((task) => {
    if (state.filter === 'all') return true;
    if (state.filter === 'pending') return task.status === 'Pending';
    if (state.filter === 'completed') return task.status === 'Completed';
    return true;
  });

  const selectedTask = state.selectedTaskId
    ? state.tasks.find((t) => t._id === state.selectedTaskId) ?? null
    : null;

  const filterLabels: Record<string, string> = {
    all: 'All Tasks',
    pending: 'Pending Tasks',
    completed: 'Completed Tasks',
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setIsAddModalOpen(true);
  };

  const handleEditTask = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      dispatch({ type: 'SELECT_TASK', payload: null }); // close card first
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen library-bg">
      {/* Ambient background particles */}
      <DustParticles />

      {/* Top Navigation */}
      <TaskNav />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#faf0dd] mb-2 drop-shadow-sm">
            {filterLabels[state.filter]}
          </h2>
          <p className="text-[#a08c6a] text-base font-body">
            {state.filter === 'all'
              ? 'Every task is a story waiting to be completed'
              : state.filter === 'pending'
                ? 'Tasks in progress — keep the momentum going'
                : 'Celebrate your completed work!'}
          </p>
        </div>

        {/* Task Shelf */}
        <TaskShelf
          tasks={filteredTasks}
          onSelectTask={(id) => dispatch({ type: 'SELECT_TASK', payload: id })}
          onAddNew={handleAddNew}
          searchQuery={state.searchQuery}
          loading={state.loading}
          error={state.error}
          filterLabel={filterLabels[state.filter]}
        />
      </main>

      {/* Task Detail Card */}
      <AnimatePresence>
        {selectedTask && (
          <TaskCard
            task={selectedTask}
            onClose={() => dispatch({ type: 'SELECT_TASK', payload: null })}
            onEdit={handleEditTask}
          />
        )}
      </AnimatePresence>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        editTask={editingTask}
      />

      {/* Encouragement Toast */}
      <EncouragementToast />

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t border-amber-700/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#ffffff] text-sm font-body">
            Your work, neatly shelved.
          </p>
          <p className="text-[#ffffff] text-xs mt-2 font-body">
            -Project By Lanisha Thomas
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <TaskContent />
    </TaskProvider>
  );
}

export default App;
