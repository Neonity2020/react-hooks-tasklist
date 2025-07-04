import React from 'react';
import { CheckCircle, Clock, List } from 'lucide-react';

interface TaskStatsProps {
  total: number;
  completed: number;
  active: number;
}

// 📚 React.memo 优化统计组件
const TaskStats: React.FC<TaskStatsProps> = React.memo(({ total, completed, active }) => {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总任务</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</p>
          </div>
          <List className="text-blue-500" size={24} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">进行中</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{active}</p>
          </div>
          <Clock className="text-orange-500" size={24} />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">已完成</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{completed}</p>
          </div>
          <CheckCircle className="text-green-500" size={24} />
        </div>
      </div>
      
      {total > 0 && (
        <div className="md:col-span-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 
                        p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">完成率</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{completionRate}%</p>
            </div>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TaskStats.displayName = 'TaskStats';

export default TaskStats;