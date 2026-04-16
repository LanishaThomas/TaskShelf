import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, AlignLeft, Tag, X, Zap } from 'lucide-react';
import { useTask } from '@/store/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Task, TaskPriority } from '@/types';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; emoji: string; activeClass: string }> = {
  High:   { label: 'High',   emoji: '🔴', activeClass: 'bg-red-900/30 border-red-500/60 text-red-300' },
  Medium: { label: 'Medium', emoji: '🟡', activeClass: 'bg-amber-700/30 border-amber-500/60 text-amber-300' },
  Low:    { label: 'Low',    emoji: '🟢', activeClass: 'bg-green-900/30 border-green-500/60 text-green-300' },
};

export function AddTaskModal({ isOpen, onClose, editTask }: AddTaskModalProps) {
  const { createTask, updateTask } = useTask();
  const isEditMode = !!editTask;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'Pending' as 'Pending' | 'Completed',
    priority: 'Medium' as TaskPriority,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description || '',
        deadline: editTask.deadline
          ? new Date(editTask.deadline).toISOString().split('T')[0]
          : '',
        status: editTask.status,
        priority: editTask.priority || 'Medium',
      });
    } else {
      setFormData({ title: '', description: '', deadline: '', status: 'Pending', priority: 'Medium' });
    }
    setError('');
  }, [editTask, isOpen]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      if (isEditMode && editTask) {
        await updateTask(editTask._id, {
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline || null,
          status: formData.status,
          priority: formData.priority,
        });
      } else {
        await createTask({
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
          status: formData.status,
          priority: formData.priority,
        });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-[#2d2418] border-amber-700/30 text-[#faf0dd] p-0 overflow-hidden">
        {/* Header accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="flex items-center gap-3 font-heading text-xl text-[#faf0dd]">
              <div className="p-2 rounded-lg bg-amber-700/25 text-amber-400">
                <Plus className="w-5 h-5" />
              </div>
              {isEditMode ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-[#d4c4a8] font-ui text-sm flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                Title <span className="text-amber-400">*</span>
              </Label>
              <Input
                id="task-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="What needs to be done?"
                className="bg-[#1a1510] border-amber-700/30 text-[#faf0dd] placeholder:text-[#5c4033] focus:border-amber-500 font-body"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-[#d4c4a8] font-ui text-sm flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-amber-500" />
                Description
              </Label>
              <Textarea
                id="task-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this task..."
                className="bg-[#1a1510] border-amber-700/30 text-[#faf0dd] placeholder:text-[#5c4033] focus:border-amber-500 font-body resize-none"
                rows={3}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <Label className="text-[#d4c4a8] font-ui text-sm flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                Deadline
              </Label>
              <Input
                id="task-deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-[#1a1510] border-amber-700/30 text-[#faf0dd] focus:border-amber-500 font-body"
                style={{ colorScheme: 'dark' }}
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <Label className="text-[#d4c4a8] font-ui text-sm flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Priority
              </Label>
              <div className="flex gap-2">
                {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  return (
                    <button
                      key={p}
                      id={`priority-${p.toLowerCase()}`}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`flex-1 py-2 px-3 rounded-lg border font-ui text-sm transition-all flex items-center justify-center gap-1.5 ${
                        formData.priority === p
                          ? cfg.activeClass
                          : 'border-amber-700/20 text-[#8b7355] hover:border-amber-700/40 hover:text-[#d4c4a8]'
                      }`}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <Label className="text-[#d4c4a8] font-ui text-sm">Status</Label>
              <div className="flex gap-2">
                {(['Pending', 'Completed'] as const).map((s) => (
                  <button
                    key={s}
                    id={`status-${s.toLowerCase()}`}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={`flex-1 py-2 px-3 rounded-lg border font-ui text-sm transition-all ${
                      formData.status === s
                        ? s === 'Pending'
                          ? 'bg-amber-700/30 border-amber-500/60 text-amber-300'
                          : 'bg-green-800/30 border-green-600/60 text-green-300'
                        : 'border-amber-700/20 text-[#8b7355] hover:border-amber-700/40'
                    }`}
                  >
                    {s === 'Pending' ? '⏳' : '✅'} {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm font-body flex items-center gap-2">
                <X className="w-4 h-4" /> {error}
              </motion.p>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-2 border-t border-amber-700/20">
              <Button variant="ghost" onClick={onClose} className="text-[#d4c4a8] hover:text-[#faf0dd] font-ui" disabled={submitting}>
                Cancel
              </Button>
              <Button
                id="submit-task"
                onClick={handleSubmit}
                disabled={submitting || !formData.title.trim()}
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-ui gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {submitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Task'}
              </Button>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
