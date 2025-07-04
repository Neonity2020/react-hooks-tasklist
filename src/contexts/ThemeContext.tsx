import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 📚 useContext Hook 演示
// useContext 允许组件订阅 React Context 的变化，避免 prop drilling
// 这里我们创建一个主题上下文来管理全局的主题状态

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// 创建 Context，提供默认值
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 🎯 useState Hook: 管理主题状态
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 初始化时从 localStorage 读取用户偏好
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // 🎯 useEffect Hook: 处理副作用
  // 当主题变化时，同步到 localStorage 和 document.documentElement
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // 动态切换 HTML 元素的 dark 类，配合 Tailwind 的 dark: 前缀
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // 🎯 useCallback Hook: 优化函数引用
  // 防止不必要的重新渲染，特别是当这个函数传递给子组件时
  const toggleTheme = React.useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const value = {
    isDark,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 自定义 Hook 来使用主题上下文
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};