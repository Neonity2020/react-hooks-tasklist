# React Hooks 任务管理器 📝

一个用于演示和学习 React Hooks 核心概念的实用任务管理应用。通过实际的代码示例，深入理解 React Hooks 的使用场景和最佳实践。

## 🌟 在线演示

**部署地址：** [https://react-hooks-tasklist.netlify.app](https://react-hooks-tasklist.netlify.app)

## 📋 功能特性

### 核心功能

- ✅ **任务管理**：添加、删除、标记完成状态
- 📊 **统计信息**：实时显示任务总数、进行中、已完成数量和完成率
- 🔍 **智能过滤**：按状态筛选任务（全部/进行中/已完成）
- 💾 **数据持久化**：自动保存到本地存储
- 🌙 **主题切换**：支持明暗主题切换
- 📱 **响应式设计**：适配各种屏幕尺寸

### 技术亮点

- 🎯 **完整的 Hooks 演示**：涵盖 6 个核心 React Hooks
- ⚡ **性能优化**：使用 React.memo、useCallback、useMemo
- 🏗️ **模块化架构**：清晰的组件分离和代码组织
- 🎨 **现代 UI**：基于 Tailwind CSS 的精美界面
- 📚 **详细注释**：每个 Hook 都有详细的使用说明

## 🎯 React Hooks 演示

### 1. useState - 状态管理

```typescript
// 管理表单输入状态
const [inputText, setInputText] = useState('');

// 管理主题状态
const [isDark, setIsDark] = useState<boolean>(() => {
  const saved = localStorage.getItem('theme');
  return saved === 'dark';
});
```

**使用场景：**

- 表单输入控制
- 组件内部状态管理
- 简单的布尔值切换

### 2. useEffect - 副作用处理

```typescript
// 组件挂载时加载数据
useEffect(() => {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    const parsedTasks: Task[] = JSON.parse(savedTasks);
    dispatch({ type: 'LOAD_TASKS', payload: { tasks: parsedTasks } });
  }
}, []);

// 监听状态变化并同步到本地存储
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
}, [state.tasks]);
```

**使用场景：**

- 数据获取和同步
- 订阅和清理
- DOM 操作

### 3. useContext - 全局状态管理

```typescript
// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 在组件中使用
const { isDark, toggleTheme } = useTheme();
```

**使用场景：**

- 全局主题管理
- 用户认证状态
- 多语言支持

### 4. useReducer - 复杂状态管理

```typescript
// 定义 reducer
export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, newTask] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload.id) };
    // ... 更多操作
  }
};

// 在组件中使用
const [state, dispatch] = useReducer(taskReducer, initialTaskState);
```

**使用场景：**

- 复杂的状态逻辑
- 多个相关状态值
- 状态更新依赖于前一个状态

### 5. useCallback - 函数优化

```typescript
// 优化事件处理函数，防止子组件不必要的重新渲染
const handleAddTask = useCallback((text: string) => {
  dispatch({ type: 'ADD_TASK', payload: { text } });
}, []);

const handleToggleTask = useCallback((id: string) => {
  dispatch({ type: 'TOGGLE_TASK', payload: { id } });
}, []);
```

**使用场景：**

- 传递给子组件的回调函数
- 依赖数组为空或很少变化的函数
- 配合 React.memo 使用

### 6. useMemo - 计算结果缓存

```typescript
// 缓存计算结果，避免每次渲染都重新计算
const taskStats = useMemo(() => {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.completed).length;
  const active = total - completed;
  return { total, completed, active };
}, [state.tasks]);

// 缓存过滤后的任务列表
const filteredTasks = useMemo(() => {
  switch (state.filter) {
    case 'active': return state.tasks.filter(task => !task.completed);
    case 'completed': return state.tasks.filter(task => task.completed);
    default: return state.tasks;
  }
}, [state.tasks, state.filter]);
```

**使用场景：**

- 计算成本较高的操作
- 基于 props 或 state 的派生数据
- 避免不必要的重新计算

## 🏗️ 项目结构

```
src/
├── components/           # 组件目录
│   ├── TaskForm.tsx     # 任务表单组件
│   ├── TaskList.tsx     # 任务列表组件
│   ├── TaskItem.tsx     # 单个任务组件
│   ├── TaskStats.tsx    # 统计信息组件
│   └── TaskFilters.tsx  # 过滤器组件
├── contexts/            # Context 目录
│   └── ThemeContext.tsx # 主题上下文
├── reducers/            # Reducer 目录
│   └── taskReducer.ts   # 任务状态管理
├── types/               # 类型定义
│   └── Task.ts          # 任务类型定义
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### Supabase 环境变量配置

1. 在项目根目录下新建 `.env` 文件，内容如下（用你的实际 Supabase 信息替换）：

```env
VITE_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
```

2. `.env` 文件**不要上传到 GitHub**（已在 `.gitignore` 中配置）。
3. 生产环境部署时，也需在服务器根目录配置 `.env` 文件。

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 🛠️ 技术栈

- **前端框架：** React 18
- **构建工具：** Vite
- **样式框架：** Tailwind CSS
- **图标库：** Lucide React
- **类型检查：** TypeScript
- **代码规范：** ESLint
- **部署平台：** Netlify

## 📚 学习要点

### React Hooks 最佳实践

1. **合理选择 Hook**

   - 简单状态用 `useState`
   - 复杂状态用 `useReducer`
   - 全局状态用 `useContext`

2. **性能优化**

   - 使用 `useCallback` 优化函数引用
   - 使用 `useMemo` 缓存计算结果
   - 配合 `React.memo` 防止不必要的重新渲染

3. **副作用管理**

   - 正确使用 `useEffect` 的依赖数组
   - 及时清理副作用（如定时器、订阅）
   - 避免无限循环

4. **代码组织**
   - 将相关逻辑提取到自定义 Hook
   - 保持组件职责单一
   - 合理使用 Context，避免过度使用

### 常见陷阱和解决方案

1. **useEffect 无限循环**

   ```typescript
   // ❌ 错误：缺少依赖数组
   useEffect(() => {
     setCount(count + 1);
   });

   // ✅ 正确：添加依赖数组
   useEffect(() => {
     setCount(prev => prev + 1);
   }, []);
   ```

2. **useCallback 依赖遗漏**

   ```typescript
   // ❌ 错误：遗漏依赖
   const handleClick = useCallback(() => {
     console.log(someValue);
   }, []);

   // ✅ 正确：包含所有依赖
   const handleClick = useCallback(() => {
     console.log(someValue);
   }, [someValue]);
   ```

## 🎨 界面特性

- **现代化设计**：简洁直观的用户界面
- **响应式布局**：适配桌面端和移动端
- **主题切换**：支持明暗两种主题
- **动画效果**：流畅的交互动画
- **无障碍支持**：良好的键盘导航和屏幕阅读器支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用于构建用户界面的 JavaScript 库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide React](https://lucide.dev/) - 美观的开源图标库

---

**学习 React Hooks，从实践开始！** 🚀

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
