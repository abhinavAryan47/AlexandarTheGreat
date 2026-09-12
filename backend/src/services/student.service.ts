import { Student } from '../models/student.model';
import { CreateStudentInput, UpdateStudentInput } from '../schemas/student.schema';
import { StudentRepository, studentRepository } from '../repositories/student.repository';

export class StudentService {
  constructor(private repo: StudentRepository = studentRepository) {}

  async getAllStudents(): Promise<Student[]> {
    return this.repo.getAll();
  }

  async getStudentById(id: string): Promise<Student | null> {
    return this.repo.getById(id);
  }

  async createStudent(input: CreateStudentInput): Promise<Student> {
    return this.repo.create(input);
  }

  async updateStudent(id: string, input: UpdateStudentInput): Promise<Student | null> {
    return this.repo.update(id, input);
  }

  async deleteStudent(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}

export const studentService = new StudentService();
