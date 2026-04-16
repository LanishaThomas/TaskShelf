import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Trash2, CheckCircle2, Clock, Calendar, AlignLeft, RotateCcw, Zap } from 'lucide-react';
import { useTask } from '@/store/TaskContext';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import type { Task, TaskPriority } from '@/types';

interface TaskCardProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

export function TaskCard({ task, onClose, onEdit }: TaskCardProps) {
  const { deleteTask, toggleStatus } = useTask();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isCompleted = task.status === 'Completed';
  const priority: TaskPriority = task.priority || 'Medium';

  const PRIORITY_STYLE: Record<TaskPriority, { bg: string; text: string; border: string; label: string }> = {
    High:   { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    label: '🔴 High' },
    Medium: { bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-300',  label: '🟡 Medium' },
    Low:    { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  label: '🟢 Low' },
  };
  const ps = PRIORITY_STYLE[priority];

  const getDeadlineInfo = () => {
    if (!task.deadline) return null;
    const d = new Date(task.deadline);
    const formatted = format(d, 'MMMM d, yyyy');

    if (isCompleted) return { label: formatted, color: 'text-[#8b7355]', urgent: false };
    if (isPast(d) && !isToday(d)) {
      const daysAgo = Math.abs(differenceInDays(d, new Date()));
      return { label: `${formatted} · ${daysAgo}d overdue`, color: 'text-red-400', urgent: true };
    }
    if (isToday(d)) return { label: `${formatted} · Due today!`, color: 'text-amber-400', urgent: true };
    const daysLeft = differenceInDays(d, new Date());
    if (daysLeft <= 3) return { label: `${formatted} · ${daysLeft}d left`, color: 'text-amber-300', urgent: true };
    return { label: formatted, color: 'text-[#c4b5a0]', urgent: false };
  };

  const deadlineInfo = getDeadlineInfo();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task._id);
      onClose();
    } catch {
      setDeleting(false);
    }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      await toggleStatus(task);
    } finally {
      setToggling(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Open Book Layout ── */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl" style={{ perspective: '1500px' }}>
            {/* Left page — gradient spine effect */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#2d2418] to-[#3d3224] z-10" />

            {/* Book page background */}
            <div
              className="book-page book-page-lines min-h-[480px] p-8 pl-14"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Close button */}
              <button
                id="close-task-card"
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#8b7355]/20 flex items-center justify-center text-[#8b7355] hover:bg-[#8b7355]/40 hover:text-[#3d3224] transition-colors z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status + Priority badges */}
              <div className="mb-6 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-ui font-medium ${
                  isCompleted
                    ? 'bg-slate-200 text-slate-600 border border-slate-400'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {task.status}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-ui font-medium border ${ps.bg} ${ps.text} ${ps.border}`}>
                  <Zap className="w-3.5 h-3.5" />
                  {ps.label}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-heading text-2xl sm:text-3xl font-bold text-[#3d2c08] mb-4 leading-tight"
                style={{ textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.7 : 1 }}
              >
                {task.title}
              </h2>

              {/* Decorative rule */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-[#8b7355]/30" />
                <span className="text-[#8b7355]/50 text-xs font-ui">✦</span>
                <div className="h-px flex-1 bg-[#8b7355]/30" />
              </div>

              {/* Description */}
              {task.description && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2 text-[#8b7355]">
                    <AlignLeft className="w-4 h-4" />
                    <span className="font-ui text-sm font-medium">Description</span>
                  </div>
                  <p className="text-[#5c4033] leading-relaxed font-body text-base whitespace-pre-line">
                    {task.description}
                  </p>
                </div>
              )}

              {!task.description && (
                <p className="text-[#8b7355]/60 italic font-body text-sm mb-6">No description provided.</p>
              )}

              {/* Meta info */}
              <div className="space-y-2 mb-8">
                {deadlineInfo && (
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-4 h-4 ${deadlineInfo.urgent ? deadlineInfo.color : 'text-[#8b7355]'}`} />
                    <span className={`font-ui text-sm ${deadlineInfo.color}`}>
                      {deadlineInfo.label}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#8b7355]/70">
                  <span className="font-ui text-xs">
                    Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
                  </span>
                  {task.updatedAt !== task.createdAt && (
                    <>
                      <span>·</span>
                      <span className="font-ui text-xs">
                        Updated {format(new Date(task.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#8b7355]/20">
                {/* Toggle Status */}
                <motion.button
                  id="toggle-status-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggle}
                  disabled={toggling}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium transition-all ${
                    isCompleted
                      ? 'bg-slate-200 text-slate-600 border border-slate-400 hover:bg-slate-300'
                      : 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                  } disabled:opacity-60`}
                >
                  {toggling ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : isCompleted ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {isCompleted ? 'Mark Pending' : 'Mark Complete'}
                </motion.button>

                {/* Edit */}
                <motion.button
                  id="edit-task-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium bg-[#8b7355]/15 text-[#5c4033] border border-[#8b7355]/30 hover:bg-[#8b7355]/25 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </motion.button>

                {/* Delete */}
                <motion.button
                  id="delete-task-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-all disabled:opacity-60 ml-auto"
                >
                  {deleting ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  {deleting ? 'Deleting...' : 'Delete'}
                </motion.button>
              </div>
            </div>

            {/* Right page border shadow */}
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-[#8b7355]/20 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
