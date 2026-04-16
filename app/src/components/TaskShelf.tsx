import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskBookSpine } from './TaskBookSpine';
import { SortBar } from './SortBar';
import { ShelfDecoration } from './ShelfDecoration';
import type { Task, SortConfig, FilterType } from '@/types';
import { PRIORITY_WEIGHT } from '@/types';
import { Plus, CheckSquare, Loader2, ServerCrash, WifiOff, RefreshCw } from 'lucide-react';

interface TaskShelfProps {
  tasks: Task[];
  filter: FilterType;
  onSelectTask: (id: string) => void;
  onAddNew: () => void;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  filterLabel: string;
}

// ── Sorting helpers ─────────────────────────────────────
function sortTasks(tasks: Task[], config: SortConfig): Task[] {
  return [...tasks].sort((a, b) => {
    let result = 0;

    switch (config.by) {
      case 'deadline': {
        // Nulls always go to end regardless of direction
        if (!a.deadline && !b.deadline) {
          result = 0;
          break;
        }
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        result = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      }
      case 'priority': {
        result = PRIORITY_WEIGHT[a.priority || 'Medium'] - PRIORITY_WEIGHT[b.priority || 'Medium'];
        break;
      }
      case 'updatedAt': {
        result = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      }
      case 'createdAt':
      default: {
        result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      }
    }

    return config.order === 'asc' ? result : -result;
  });
}

export function TaskShelf({
  tasks,
  filter,
  onSelectTask,
  onAddNew,
  searchQuery,
  loading,
  error,
  filterLabel,
}: TaskShelfProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ by: 'createdAt', order: 'desc' });

  // 0) Hard guard — enforce filter even if parent passes wrong tasks
  const guardedTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'Pending';
    if (filter === 'completed') return t.status === 'Completed';
    return true;
  });

  // 1) Search filter
  const filteredTasks = searchQuery
    ? guardedTasks.filter((t) => {
        const q = searchQuery.toLowerCase();
        return t.title.toLowerCase().includes(q) || (t.description?.toLowerCase().includes(q) ?? false);
      })
    : guardedTasks;

  // 2) Sort
  const sortedTasks = sortTasks(filteredTasks, sortConfig);

  // 3) Group into shelf rows (6 books per row)
  const ITEMS_PER_ROW = 6;
  const rows: Task[][] = [];
  for (let i = 0; i < sortedTasks.length; i += ITEMS_PER_ROW) {
    rows.push(sortedTasks.slice(i, i + ITEMS_PER_ROW));
  }

  // ── Loading ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-amber-400" />
        </motion.div>
        <p className="text-[#a08c6a] font-body text-base">Loading your task library...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-red-900/25 border border-red-700/30 flex items-center justify-center mb-6">
          <ServerCrash className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="font-heading text-xl font-bold text-[#faf0dd] mb-2">Cannot Connect to Database</h3>
        <p className="text-red-400 font-body text-sm mb-8 text-center max-w-sm">{error}</p>
        <div className="w-full max-w-md bg-[#352a18]/60 border border-amber-700/25 rounded-xl p-5 mb-6 text-left">
          <p className="font-ui font-semibold text-[#f0c830] text-sm mb-3 flex items-center gap-2">
            <WifiOff className="w-4 h-4" /> Troubleshooting Checklist
          </p>
          <ol className="space-y-2">
            {[
              'Atlas → Network Access → Add IP → Allow 0.0.0.0/0 (anywhere)',
              'Password @ must be URL-encoded as %40 in MONGODB_URI',
              'Run the API server: node server.js in the project root',
              'Check Atlas cluster isn\'t paused (free tier pauses after inactivity)',
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-[#d4c4a8] text-sm font-body">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-700/30 text-amber-400 text-xs flex items-center justify-center font-ui font-bold">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 text-[#faf0dd] font-ui font-semibold shadow-lg"
        >
          <RefreshCw className="w-4 h-4" /> Retry Connection
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Shelf Header ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 px-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-800/25 text-amber-400 border border-amber-600/20">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#faf0dd]">{filterLabel}</h2>
            <p className="text-sm text-[#a08c6a] font-body">
              {guardedTasks.length} {guardedTasks.length === 1 ? 'task' : 'tasks'}
              {searchQuery && filteredTasks.length !== guardedTasks.length && (
                <span className="text-amber-400/80"> · {filteredTasks.length} matching</span>
              )}
            </p>
          </div>
        </div>
        <motion.button
          id="add-task-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-ui font-semibold shadow-lg shadow-amber-900/30 hover:shadow-amber-700/40 transition-all text-sm border border-amber-500/30"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </motion.button>
      </motion.div>

      {/* ── Sort Bar ──────────────────────────────────── */}
      <SortBar sortConfig={sortConfig} onChange={setSortConfig} />

      {/* ── Priority Legend ───────────────────────────── */}
      <div className="flex items-center gap-4 px-4 mb-6">
        <span className="text-[#a08c6a] font-ui text-xs">Priority Colors:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6b2424]" />
          <span className="font-ui text-xs text-[#e87070]">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7a5c1a]" />
          <span className="font-ui text-xs text-[#f0c830]">Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#166534]" />
          <span className="font-ui text-xs text-[#4ade80]">Low</span>
        </div>
      </div>

      {/* ── Empty State ──────────────────────────────── */}
      {sortedTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4"
        >
          <div className="w-28 h-36 rounded-xl bg-gradient-to-br from-[#46391e] to-[#352a18] flex items-center justify-center mb-6 shadow-inner border border-amber-700/15">
            <CheckSquare className="w-10 h-10 text-amber-700/50" />
          </div>
          <h3 className="font-heading text-xl font-bold text-[#faf0dd] mb-2">
            {searchQuery ? 'No results found' : 'Your shelf is empty'}
          </h3>
          <p className="text-[#a08c6a] text-center max-w-sm font-body leading-relaxed mb-6">
            {searchQuery ? `No tasks match "${searchQuery}".` : 'Add your first task and get things done!'}
          </p>
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddNew}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-ui font-semibold shadow-lg shadow-amber-900/30"
            >
              <Plus className="w-4 h-4" /> Add Your First Task
            </motion.button>
          )}
        </motion.div>
      )}

      {/* ── Shelf Rows ─────────────────────────────────── */}
      <div className="space-y-10">
        {rows.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.08 }}
            className="relative"
          >
            {/* Books Container — bottom padding matches shelf height (7 / 28px) */}
            <div className="relative px-6 sm:px-10 py-6 pb-7">
              <div className="flex justify-between items-end w-full">
                {/* Books */}
                <div className="flex justify-start gap-3 sm:gap-4 md:gap-5 flex-wrap flex-1">
                  <AnimatePresence mode="popLayout">
                    {row.map((task, taskIndex) => (
                      <TaskBookSpine
                        key={task._id}
                        task={task}
                        onClick={() => onSelectTask(task._id)}
                        index={rowIndex * ITEMS_PER_ROW + taskIndex}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Shelf Decoration (Flower Vase) — adjusted position to sit firmly on board */}
                <div className="hidden md:block mr-2 translate-y-5">
                  <ShelfDecoration />
                </div>
              </div>
            </div>

            {/* Wooden shelf board */}
            <div
              className="absolute bottom-0 left-0 right-0 h-7 rounded-sm"
              style={{
                background: 'linear-gradient(180deg, #5a4a38 0%, #3a2a12 50%, #1a1209 100%)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.06)',
              }}
            />
            {/* Shelf drop shadow */}
            <div
              className="absolute -bottom-4 left-4 right-4 h-5 opacity-50"
              style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)' }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
