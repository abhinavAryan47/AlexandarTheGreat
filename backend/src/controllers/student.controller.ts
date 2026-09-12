import { Request, Response, NextFunction } from 'express';
import { StudentService, studentService } from '../services/student.service';
import { ApiResponse } from '../utils/api-response';

export class StudentController {
  constructor(private service: StudentService = studentService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const students = await this.service.getAllStudents();
      ApiResponse.success(res, students);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const student = await this.service.getStudentById(req.params.id);
      if (!student) {
        ApiResponse.error(res, 'STUDENT_NOT_FOUND', `Student with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, student);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const student = await this.service.createStudent(req.body);
      ApiResponse.success(res, student, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const student = await this.service.updateStudent(req.params.id, req.body);
      if (!student) {
        ApiResponse.error(res, 'STUDENT_NOT_FOUND', `Student with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, student);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.deleteStudent(req.params.id);
      if (!deleted) {
        ApiResponse.error(res, 'STUDENT_NOT_FOUND', `Student with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, { message: `Student ${req.params.id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export const studentController = new StudentController();
