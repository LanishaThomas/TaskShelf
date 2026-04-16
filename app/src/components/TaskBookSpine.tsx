import { motion } from 'framer-motion';
import type { Task } from '@/types';
import { CheckCircle2, Clock, CalendarDays } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

interface TaskBookSpineProps {
  task: Task;
  onClick: () => void;
  index: number;
}

// ── Book colors keyed by PRIORITY ──────────────────────
// High (red), Medium (amber/gold), Low (green)
const PRIORITY_COLORS: Record<string, { bg: string; spine: string; accent: string; dark: string }> = {
  High:   { bg: '#a82424', spine: '#7a1515', accent: '#ff8080', dark: '#5a0a0a' }, // Red
  Medium: { bg: '#b88a1a', spine: '#8c6010', accent: '#f0c830', dark: '#5d3c08' }, // Amber
  Low:    { bg: '#166534', spine: '#14532d', accent: '#4ade80', dark: '#06200f' }, // Green
  // lowercase fallback
  high:   { bg: '#a82424', spine: '#7a1515', accent: '#ff8080', dark: '#5a0a0a' },
  medium: { bg: '#b88a1a', spine: '#8c6010', accent: '#f0c830', dark: '#5d3c08' },
  low:    { bg: '#166534', spine: '#14532d', accent: '#4ade80', dark: '#06200f' },
};

function getDeadlineColor(deadline: string | null, status: Task['status']): string {
  if (!deadline || status === 'Completed') return '#faf0dd'; // Opaque Off-white
  const d = new Date(deadline);
  if (isPast(d) && !isToday(d)) return '#ff8080'; // Bright Pink-red
  if (isToday(d)) return '#facc15'; // Bright Yellow
  return '#f5f5f5'; // Pure Opaque white
}

export function TaskBookSpine({ task, onClick, index }: TaskBookSpineProps) {
  // Explicitly handle priority with a solid fallback
  const priorityRaw = task.priority || 'Medium';
  const color = PRIORITY_COLORS[priorityRaw] || PRIORITY_COLORS['Medium'];
  const isCompleted = task.status === 'Completed';
  const deadlineColor = getDeadlineColor(task.deadline, task.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -12, scale: 1.04, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ perspective: '1000px' }}
    >
      {/* ── Book Spine ─────────────────────────── */}
      <div
        className="relative w-14 sm:w-16 md:w-20 h-48 sm:h-56 md:h-64 rounded-sm overflow-hidden"
        style={{
          background: `linear-gradient(90deg, ${color.dark} 0%, ${color.bg} 22%, ${color.bg} 78%, ${color.spine} 100%)`,
          boxShadow: `-4px 4px 14px rgba(0,0,0,0.55), inset 2px 0 4px rgba(255,255,255,0.1), inset -2px 0 4px rgba(0,0,0,0.3)`,
          transform: 'rotateY(-5deg)',
          transformStyle: 'preserve-3d',
          // Completed books: slightly desaturated + dimmed
          filter: isCompleted ? 'brightness(0.78) saturate(0.65)' : 'none',
        }}
      >
        {/* Decorative bands */}
        <div className="absolute top-4 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color.accent}55, transparent)` }} />
        <div className="absolute bottom-4 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color.accent}55, transparent)` }} />
        <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: `linear-gradient(90deg, transparent, ${color.accent}28, transparent)` }} />

        {/* Left spine highlight */}
        <div className="absolute left-1 top-0 bottom-0 w-1" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)' }} />

        {/* Title (vertical) */}
        <div className="absolute inset-0 flex items-center justify-center px-1">
          <span
            className="font-heading font-semibold tracking-wide text-center"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              fontSize: 'clamp(10px, 1.1vw, 14px)',
              color: 'rgba(250,240,221,0.94)',
              textShadow: '0 1px 4px rgba(0,0,0,0.65)',
              maxHeight: '72%',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}
          >
            {task.title}
          </span>
        </div>

        {/* Status icon with high-contrast background ring */}
        <div
          className="absolute bottom-9 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ 
            background: 'rgba(0,0,0,0.25)', 
            color: '#faf0dd',
            border: `1px solid ${color.accent}66`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
        </div>

        {/* Deadline chip */}
        {task.deadline && (
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-px"
            title={`Due: ${format(new Date(task.deadline), 'MMM d, yyyy')}`}
          >
            <CalendarDays className="w-3 h-3 flex-shrink-0" style={{ color: deadlineColor, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }} />
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '9.5px',
                fontWeight: '700',
                color: deadlineColor,
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}
            >
              {format(new Date(task.deadline), 'MMM d')}
            </span>
          </div>
        )}

        {/* Gold "completed" ribbon in top-right corner */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-6 h-6 overflow-hidden">
            <div
              className="absolute top-0 right-0 w-8 h-8 origin-top-right"
              style={{
                background: 'linear-gradient(135deg, #f0c830 50%, transparent 50%)',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        )}

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `linear-gradient(180deg, ${color.accent}18 0%, transparent 50%, ${color.accent}08 100%)` }}
        />
      </div>

      {/* Floor shadow */}
      <div
        className="absolute -bottom-2 left-1 right-1 h-3 rounded-full opacity-40"
        style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)', transform: 'scaleY(0.5)' }}
      />

      {/* Priority label on hover */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span
          className="text-[9px] font-ui font-semibold px-1.5 py-0.5 rounded"
          style={{
            background: `${color.accent}22`,
            color: color.accent,
            border: `1px solid ${color.accent}44`,
          }}
        >
          {priorityRaw}
        </span>
      </motion.div>
    </motion.div>
  );
}
