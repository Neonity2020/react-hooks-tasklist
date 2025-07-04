import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// 📚 React.memo 优化性能
// 当 props 没有变化时，避免重新渲染组件
const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, onToggle, onDelete }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      task.completed
        ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
        : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                       transition-all duration-200 ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
            {task.completed && <Check size={14} />}
          </button>
          
          <div className="flex-1">
            <p className={`text-sm font-medium transition-all duration-200 ${
              task.completed
                ? 'text-green-600 dark:text-green-400 line-through'
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {task.text}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20
                     rounded-lg transition-all duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;