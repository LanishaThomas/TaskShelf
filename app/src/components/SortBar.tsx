import { motion } from 'framer-motion';
import { ArrowUpDown, CalendarClock, Zap, Clock } from 'lucide-react';
import type { SortConfig, SortBy } from '@/types';

interface SortBarProps {
  sortConfig: SortConfig;
  onChange: (config: SortConfig) => void;
}

interface SortOption {
  by: SortBy;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  defaultOrder: 'asc' | 'desc';
}

const SORT_OPTIONS: SortOption[] = [
  {
    by: 'createdAt',
    label: 'Newest',
    icon: Clock,
    tooltip: 'Sort by date added',
    defaultOrder: 'desc',
  },
  {
    by: 'deadline',
    label: 'Deadline',
    icon: CalendarClock,
    tooltip: 'Sort by deadline date (soonest first)',
    defaultOrder: 'asc',
  },
  {
    by: 'priority',
    label: 'Priority',
    icon: Zap,
    tooltip: 'Sort by priority (High → Medium → Low)',
    defaultOrder: 'asc',
  },
];

const ORDER_LABELS: Record<'asc' | 'desc', string> = {
  asc: '↑',
  desc: '↓',
};

export function SortBar({ sortConfig, onChange }: SortBarProps) {
  const handleClick = (option: SortOption) => {
    if (sortConfig.by === option.by) {
      // Toggle direction if already selected
      onChange({ by: option.by, order: sortConfig.order === 'asc' ? 'desc' : 'asc' });
    } else {
      // Switch to new sort with its default direction
      onChange({ by: option.by, order: option.defaultOrder });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-2 px-4 mb-6 flex-wrap"
    >
      {/* Label */}
      <div className="flex items-center gap-1.5 text-[#a08c6a] font-ui text-xs mr-1">
        <ArrowUpDown className="w-3.5 h-3.5" />
        <span>Sort by</span>
      </div>

      {/* Sort Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {SORT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = sortConfig.by === option.by;
          const currentOrder = isActive ? sortConfig.order : option.defaultOrder;

          return (
            <motion.button
              key={option.by}
              id={`sort-${option.by}`}
              onClick={() => handleClick(option)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              title={option.tooltip}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-ui font-medium transition-all ${
                isActive
                  ? 'bg-amber-600/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-900/20'
                  : 'bg-[#352a18]/60 border-amber-700/20 text-[#a08c6a] hover:border-amber-600/40 hover:text-[#d4c4a8] hover:bg-[#352a18]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : ''}`} />
              {option.label}
              {/* Direction indicator */}
              <span
                className={`inline-flex items-center justify-center w-4 h-4 rounded text-[10px] font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500/30 text-amber-300'
                    : 'bg-[#46391e]/80 text-[#a08c6a]'
                }`}
              >
                {ORDER_LABELS[currentOrder]}
              </span>

              {/* Active underline */}
              {isActive && (
                <motion.div
                  layoutId="activeSortIndicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
