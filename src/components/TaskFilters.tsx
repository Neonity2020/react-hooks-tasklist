import React from 'react';
import { FilterType } from '../types/Task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    active: number;
    completed: number;
  };
}

// 📚 React.memo 优化过滤器组件
const TaskFilters: React.FC<TaskFiltersProps> = React.memo(({ 
  currentFilter, 
  onFilterChange, 
  taskCounts 
}) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: taskCounts.all },
    { key: 'active', label: '进行中', count: taskCounts.active },
    { key: 'completed', label: '已完成', count: taskCounts.completed }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentFilter === key
              ? 'bg-blue-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {label}
          {count > 0 && (
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              currentFilter === key
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
});

TaskFilters.displayName = 'TaskFilters';

export default TaskFilters;