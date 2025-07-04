import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { Sun, Moon, Trash2 } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { taskReducer, initialTaskState } from './reducers/taskReducer';
import { Task, FilterType } from './types/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';

// 主应用组件
const TaskManagerApp: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  // 📚 useReducer Hook 演示
  // 用于管理复杂的任务状态，比 useState 更适合处理多个相关状态值
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  // 🎯 useEffect Hook: 处理副作用
  // 组件挂载时从 localStorage 加载任务数据
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        dispatch({ type: 'LOAD_TASKS', payload: { tasks: parsedTasks } });
      } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
      }
    }
  }, []);

  // 🎯 useEffect Hook: 监听任务变化并保存到 localStorage
  // 依赖数组包含 state.tasks，只有当任务列表变化时才执行
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  // 🎯 useCallback Hook: 优化事件处理函数
  // 防止不必要的重新渲染，特别是当这些函数传递给子组件时
  const handleAddTask = useCallback((text: string) => {
    dispatch({ type: 'ADD_TASK', payload: { text } });
  }, []);

  const handleToggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', payload: { id } });
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: { id } });
  }, []);

  const handleFilterChange = useCallback((filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: { filter } });
  }, []);

  const handleClearCompleted = useCallback(() => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  }, []);

  // 🎯 useMemo Hook: 缓存计算结果
  // 只有当 state.tasks 变化时才重新计算，避免每次渲染都执行计算
  const taskStats = useMemo(() => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(task => task.completed).length;
    const active = total - completed;
    
    return { total, completed, active };
  }, [state.tasks]);

  // 🎯 useMemo Hook: 缓存过滤后的任务列表
  // 根据当前过滤条件计算要显示的任务，避免重复计算
  const filteredTasks = useMemo(() => {
    switch (state.filter) {
      case 'active':
        return state.tasks.filter(task => !task.completed);
      case 'completed':
        return state.tasks.filter(task => task.completed);
      default:
        return state.tasks;
    }
  }, [state.tasks, state.filter]);

  // 🎯 useMemo Hook: 缓存任务计数
  const taskCounts = useMemo(() => ({
    all: state.tasks.length,
    active: state.tasks.filter(task => !task.completed).length,
    completed: state.tasks.filter(task => task.completed).length
  }), [state.tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              React Hooks 任务管理器
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              演示 useState, useEffect, useContext, useReducer, useCallback, useMemo 的使用
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* 清除已完成任务按钮 */}
            {taskStats.completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 
                           text-white rounded-lg transition-colors duration-200"
              >
                <Trash2 size={16} />
                清除已完成
              </button>
            )}
            
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                         hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {isDark ? <Sun className="text-yellow-500" size={20} /> : <Moon className="text-blue-500" size={20} />}
            </button>
          </div>
        </div>

        {/* 任务统计 */}
        <TaskStats
          total={taskStats.total}
          completed={taskStats.completed}
          active={taskStats.active}
        />

        {/* 任务表单 */}
        <TaskForm onAddTask={handleAddTask} />

        {/* 任务过滤器 */}
        <TaskFilters
          currentFilter={state.filter}
          onFilterChange={handleFilterChange}
          taskCounts={taskCounts}
        />

        {/* 任务列表 */}
        <TaskList
          tasks={filteredTasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
        />

        {/* Hook 使用说明 */}
        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🎯 React Hooks 演示说明
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">基础 Hooks</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>useState:</strong> 管理表单输入和主题状态</li>
                <li><strong>useEffect:</strong> 处理localStorage同步</li>
                <li><strong>useContext:</strong> 全局主题管理</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">高级 Hooks</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>useReducer:</strong> 复杂任务状态管理</li>
                <li><strong>useCallback:</strong> 优化事件处理函数</li>
                <li><strong>useMemo:</strong> 缓存计算结果</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 根组件，包含主题提供者
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TaskManagerApp />
    </ThemeProvider>
  );
};

export default App;