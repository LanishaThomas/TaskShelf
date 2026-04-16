import { motion, AnimatePresence } from 'framer-motion';
import { useTask } from '@/store/TaskContext';
import { CheckCircle2, Plus, Trash2, Sparkles, Heart, Clock } from 'lucide-react';

export function EncouragementToast() {
  const { state } = useTask();

  const getIcon = () => {
    if (!state.currentEncouragement) return null;
    switch (state.currentEncouragement.type) {
      case 'new-task':
        return <Plus className="w-5 h-5 text-amber-400" />;
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'delete':
        return <Trash2 className="w-5 h-5 text-rose-400" />;
      case 'welcome':
        return <Heart className="w-5 h-5 text-amber-400" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getBackground = () => {
    if (!state.currentEncouragement) return '';
    switch (state.currentEncouragement.type) {
      case 'new-task':
        return 'from-amber-900/90 to-amber-800/90';
      case 'complete':
        return 'from-green-900/90 to-green-800/90';
      case 'delete':
        return 'from-rose-900/90 to-rose-800/90';
      case 'welcome':
        return 'from-amber-900/90 to-[#2d2418]/90';
      case 'reminder':
        return 'from-blue-900/90 to-blue-800/90';
      default:
        return 'from-[#2d2418]/95 to-[#1a1510]/95';
    }
  };

  return (
    <AnimatePresence>
      {state.showEncouragement && state.currentEncouragement && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div
            className={`relative px-6 py-4 rounded-xl bg-gradient-to-br ${getBackground()} border border-amber-600/30 shadow-2xl backdrop-blur-sm max-w-sm`}
          >
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/50 rounded-tl" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/50 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/50 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/50 rounded-br" />

            {/* Content */}
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ rotate: -10, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="p-2 rounded-lg bg-white/10"
              >
                {getIcon()}
              </motion.div>
              <div className="flex-1">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#f5e6d3] font-ui font-medium leading-relaxed text-sm"
                >
                  {state.currentEncouragement.message}
                </motion.p>
              </div>
            </div>

            {/* Sparkle dots */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-amber-300 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
