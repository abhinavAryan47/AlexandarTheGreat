export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  deadline?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  sourceNoticeId?: string;
  createdAt: string;
  updatedAt: string;
}
