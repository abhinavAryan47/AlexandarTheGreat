import { Task, TaskPriority } from '../models/task.model';
import { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema';
import { TaskRepository, taskRepository } from '../repositories/task.repository';
import { NoticeRepository, noticeRepository } from '../repositories/notice.repository';
import { StudentRepository, studentRepository } from '../repositories/student.repository';
import { OpportunityRepository, opportunityRepository } from '../repositories/opportunity.repository';
import { relevanceService, RelevanceService } from './relevance.service';
import { priorityService, PriorityService } from './priority.service';

export class TaskService {
  constructor(
    private repo: TaskRepository = taskRepository,
    private noticeRepo: NoticeRepository = noticeRepository,
    private studentRepo: StudentRepository = studentRepository,
    private oppRepo: OpportunityRepository = opportunityRepository,
    private relevance: RelevanceService = relevanceService,
    private priority: PriorityService = priorityService
  ) {}

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

  async createTasksFromNotice(noticeId: string, studentId: string): Promise<Task[]> {
    const notice = await this.noticeRepo.getById(noticeId);
    if (!notice) {
      throw new Error(`Notice with id ${noticeId} not found`);
    }

    const student = await this.studentRepo.getById(studentId);
    if (!student) {
      throw new Error(`Student with id ${studentId} not found`);
    }

    const opportunities = await this.oppRepo.findByNoticeId(noticeId);
    const opportunity = opportunities[0];

    // Compute priority for this student
    const rel = this.relevance.calculate(student, {
      title: notice.title,
      category: notice.category,
      description: notice.content,
      deadline: opportunity?.deadline
    });
    const calculatedPriority: TaskPriority = this.priority.mapScoreToPriority(rel.relevanceScore);

    // Extract potential action lines from notice content
    const actionSentences: string[] = [];
    const lines = notice.content.split(/[.\n]/).map(l => l.trim()).filter(l => l.length > 10);
    
    // Look for imperative keywords
    const actionKeywords = ['submit', 'apply', 'register', 'download', 'upload', 'verify', 'select', 'attend', 'complete'];
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (actionKeywords.some(kw => lower.includes(kw))) {
        actionSentences.push(line);
      }
    }

    if (actionSentences.length === 0) {
      actionSentences.push(`Review and take action on ${notice.title}`);
    }

    const createdTasks: Task[] = [];
    for (const action of actionSentences.slice(0, 3)) {
      const task = await this.repo.create({
        studentId,
        title: action.length > 120 ? `${action.slice(0, 117)}...` : action,
        description: `Action item generated from notice: ${notice.title}`,
        deadline: opportunity?.deadline || undefined,
        status: 'pending',
        priority: calculatedPriority,
        sourceNoticeId: notice.id
      });
      createdTasks.push(task);
    }

    return createdTasks;
  }
}

export const taskService = new TaskService();
