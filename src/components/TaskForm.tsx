import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (text: string) => void;
}

// 📚 React.memo 和 useCallback 的配合使用
// React.memo 防止不必要的重新渲染，配合父组件的 useCallback 使用效果更佳
const TaskForm: React.FC<TaskFormProps> = React.memo(({ onAddTask }) => {
  // 🎯 useState Hook: 管理表单输入状态
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAddTask(inputText.trim());
      setInputText(''); // 清空输入框
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="添加新任务..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder-gray-500 dark:placeholder-gray-400
                     transition-colors duration-200"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                     transition-colors duration-200 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputText.trim()}
        >
          <Plus size={20} />
          添加
        </button>
      </div>
    </form>
  );
});

TaskForm.displayName = 'TaskForm';

export default TaskForm;