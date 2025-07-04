import { Task } from '../types/Task';

// 📚 useReducer Hook 演示
// useReducer 适用于复杂的状态逻辑，特别是当状态更新逻辑涉及多个子值或下一个状态依赖于之前的状态时
// 相比 useState，useReducer 提供了更可预测的状态更新机制

export interface TaskState {
  tasks: Task[];
  filter: 'all' | 'active' | 'completed';
}

// 定义所有可能的 action 类型
export type TaskAction =
  | { type: 'ADD_TASK'; payload: { text: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_TASK'; payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: 'all' | 'active' | 'completed' } }
  | { type: 'LOAD_TASKS'; payload: { tasks: Task[] } }
  | { type: 'CLEAR_COMPLETED' };

// 🎯 Reducer 函数：纯函数，接收当前状态和 action，返回新状态
// 这种模式确保了状态更新的可预测性和可测试性
export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'ADD_TASK':
      // 添加新任务
      const newTask: Task = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        createdAt: Date.now()
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask]
      };

    case 'DELETE_TASK':
      // 删除指定任务
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload.id)
      };

    case 'TOGGLE_TASK':
      // 切换任务完成状态
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task
        )
      };

    case 'SET_FILTER':
      // 设置过滤条件
      return {
        ...state,
        filter: action.payload.filter
      };

    case 'LOAD_TASKS':
      // 从本地存储加载任务
      return {
        ...state,
        tasks: action.payload.tasks
      };

    case 'CLEAR_COMPLETED':
      // 清除已完成的任务
      return {
        ...state,
        tasks: state.tasks.filter(task => !task.completed)
      };

    default:
      return state;
  }
};

// 初始状态
export const initialTaskState: TaskState = {
  tasks: [],
  filter: 'all'
};