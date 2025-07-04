import React from 'react';
import { Task } from '../types/Task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

// 📚 React.memo 的使用场景
// 当父组件重新渲染时，如果传递给子组件的 props 没有变化，React.memo 会跳过子组件的渲染
const TaskList: React.FC<TaskListProps> = React.memo(({ tasks, onToggleTask, onDeleteTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 text-lg">
          暂无任务
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          添加一个任务开始吧！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
});

TaskList.displayName = 'TaskList';

export default TaskList;