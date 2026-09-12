import { JsonRepository } from './json.repository';
import { Student } from '../models/student.model';

export class StudentRepository extends JsonRepository<Student> {
  constructor(customDir?: string) {
    super('students.json', customDir);
  }

  async findByEmail(email: string): Promise<Student | null> {
    const students = await this.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    return students[0] || null;
  }
}

export const studentRepository = new StudentRepository();
