import { JsonRepository } from './json.repository';
import { Task } from '../models/task.model';

export class TaskRepository extends JsonRepository<Task> {
  constructor(customDir?: string) {
    super('tasks.json', customDir);
  }

  async findByStudentId(studentId: string): Promise<Task[]> {
    return this.find((t) => t.studentId === studentId);
  }

  async findByNoticeId(noticeId: string): Promise<Task[]> {
    return this.find((t) => t.sourceNoticeId === noticeId);
  }
}

export const taskRepository = new TaskRepository();
