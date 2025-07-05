import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Sun, Moon, Trash2 } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Task, FilterType } from './types/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import type { User } from '@supabase/supabase-js';
import { getTasks, addTask, toggleTask, deleteTask, clearCompleted } from './api/taskApi';

// 主应用组件
interface TaskManagerAppProps {
  user: User;
}
const TaskManagerApp: React.FC<TaskManagerAppProps> = ({ user }) => {
  const { isDark, toggleTheme } = useTheme();

  // 用于管理任务和过滤条件
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 拉取任务
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(user.id);
      setTasks(data);
    } catch {
      setError('任务加载失败');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchTasks();
    // 实时推送订阅
    const channel = supabase.channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks, user.id]);

  // 新增任务
  const handleAddTask = useCallback(async (text: string) => {
    try {
      await addTask(user.id, text);
      fetchTasks();
    } catch {
      setError('添加任务失败');
    }
  }, [user.id, fetchTasks]);

  // 切换完成
  const handleToggleTask = useCallback(async (id: string) => {
    try {
      await toggleTask(user.id, id);
      fetchTasks();
    } catch {
      setError('切换任务状态失败');
    }
  }, [user.id, fetchTasks]);

  // 删除任务
  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await deleteTask(user.id, id);
      fetchTasks();
    } catch {
      setError('删除任务失败');
    }
  }, [user.id, fetchTasks]);

  // 过滤条件
  const handleFilterChange = useCallback((filter: FilterType) => {
    setFilter(filter);
  }, []);

  // 清除已完成
  const handleClearCompleted = useCallback(async () => {
    try {
      await clearCompleted(user.id);
      fetchTasks();
    } catch {
      setError('清除已完成任务失败');
    }
  }, [user.id, fetchTasks]);

  // 过滤和统计
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [tasks]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  }), [tasks]);

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
              演示 useState, useEffect, useContext, useCallback, useMemo 的使用
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* 清除已完成任务按钮 */}
            {taskStats.completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 min-w-0 w-auto"
                title="清除已完成"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">清除已完成</span>
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
        {/* 错误提示 */}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        {/* 任务统计 */}
        <TaskStats total={taskStats.total} completed={taskStats.completed} active={taskStats.active} />
        {/* 任务表单 */}
        <TaskForm onAddTask={handleAddTask} />
        {/* 任务过滤器 */}
        <TaskFilters currentFilter={filter} onFilterChange={handleFilterChange} taskCounts={taskCounts} />
        {/* 任务列表 */}
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-300 py-8">任务加载中...</div>
        ) : (
          <TaskList tasks={filteredTasks} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />
        )}
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查当前登录用户
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
    // 监听登录状态变化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-300">加载中...</div>;
  }

  return (
    <ThemeProvider>
      {user ? <TaskManagerApp user={user} /> : <Auth />}
    </ThemeProvider>
  );
};

export default App;