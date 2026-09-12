import { Task } from '../models/task.model';
import { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema';
import { TaskRepository, taskRepository } from '../repositories/task.repository';

export class TaskService {
  constructor(private repo: TaskRepository = taskRepository) {}

  async getAllTasks(): Promise<Task[]> {
    return this.repo.getAll();
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.repo.getById(id);
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    return this.repo.create(input);
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task | null> {
    return this.repo.update(id, input);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  async getTasksByStudentId(studentId: string): Promise<Task[]> {
    return this.repo.findByStudentId(studentId);
  }
}

export const taskService = new TaskService();
