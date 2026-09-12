import { Request, Response, NextFunction } from 'express';
import { TaskService, taskService } from '../services/task.service';
import { ApiResponse } from '../utils/api-response';

export class TaskController {
  constructor(private service: TaskService = taskService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.service.getAllTasks();
      ApiResponse.success(res, tasks);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.service.getTaskById(req.params.id);
      if (!task) {
        ApiResponse.error(res, 'TASK_NOT_FOUND', `Task with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, task);
    } catch (error) {
      next(error);
    }
  };

  getByStudentId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.service.getTasksByStudentId(req.params.studentId);
      ApiResponse.success(res, tasks);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.service.createTask(req.body);
      ApiResponse.success(res, task, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.service.updateTask(req.params.id, req.body);
      if (!task) {
        ApiResponse.error(res, 'TASK_NOT_FOUND', `Task with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, task);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.deleteTask(req.params.id);
      if (!deleted) {
        ApiResponse.error(res, 'TASK_NOT_FOUND', `Task with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, { message: `Task ${req.params.id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export const taskController = new TaskController();
