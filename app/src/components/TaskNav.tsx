import { motion } from 'framer-motion';
import { CheckSquare, Clock, CheckCircle2, Search } from 'lucide-react';
import { useTask } from '@/store/TaskContext';
import { Input } from '@/components/ui/input';
import type { FilterType } from '@/types';

export function TaskNav() {
  const { state, dispatch } = useTask();

  const filters: { id: FilterType; label: string; icon: typeof Clock; count?: number }[] = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: CheckSquare,
      count: state.tasks.length,
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      count: state.tasks.filter((t) => t.status === 'Pending').length,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: state.tasks.filter((t) => t.status === 'Completed').length,
    },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full bg-[#221c10]/96 backdrop-blur-md border-b border-amber-600/25 shadow-lg shadow-black/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/50">
                <CheckSquare className="w-5 h-5 text-[#f5e6d3]" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl text-[#faf0dd] tracking-tight">TaskShelf</h1>
              <p className="text-xs text-[#a08c6a] font-body">Your Daily Task Library</p>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = state.filter === filter.id;

              return (
                <motion.button
                  key={filter.id}
                  id={`filter-${filter.id}`}
                  onClick={() => dispatch({ type: 'SET_FILTER', payload: filter.id })}
                  className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all font-ui text-sm font-medium ${
                    isActive
                      ? 'bg-amber-600/25 text-amber-300'
                      : 'text-[#a08c6a] hover:text-[#d4c4a8] hover:bg-[#352a18]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{filter.label}</span>
                  {filter.count !== undefined && filter.count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-amber-500 text-white' : 'bg-[#46391e] text-[#a08c6a]'
                      }`}
                    >
                      {filter.count}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-amber-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Side — Search */}
          <div className="flex items-center relative">
            <Search className="absolute left-3 w-4 h-4 text-[#8b7355]" />
            <Input
              id="search-tasks"
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              placeholder="Search tasks..."
              className="w-40 pl-9 bg-[#352a18] border-amber-600/30 text-[#faf0dd] placeholder:text-[#a08c6a] focus:w-56 transition-all font-body text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7355]" />
          <Input
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            placeholder="Search your tasks..."
            className="w-full pl-9 bg-[#2d2418] border-amber-700/30 text-[#f5e6d3] placeholder:text-[#8b7355] font-body text-sm"
          />
        </div>
      </div>
    </motion.nav>
  );
}
