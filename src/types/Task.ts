// 定义任务的数据结构
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// 定义任务过滤选项
export type FilterType = 'all' | 'active' | 'completed';