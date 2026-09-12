import { DashboardData } from '../models/dashboard.model';
import { StudentRepository, studentRepository } from '../repositories/student.repository';
import { TaskRepository, taskRepository } from '../repositories/task.repository';
import { OpportunityRepository, opportunityRepository } from '../repositories/opportunity.repository';
import { NoticeRepository, noticeRepository } from '../repositories/notice.repository';

export class DashboardService {
  constructor(
    private studentRepo: StudentRepository = studentRepository,
    private taskRepo: TaskRepository = taskRepository,
    private oppRepo: OpportunityRepository = opportunityRepository,
    private noticeRepo: NoticeRepository = noticeRepository
  ) {}

  async getStudentDashboard(studentId: string): Promise<DashboardData | null> {
    const student = await this.studentRepo.getById(studentId);
    if (!student) {
      return null;
    }

    const [tasks, opportunities, notices] = await Promise.all([
      this.taskRepo.findByStudentId(studentId),
      this.oppRepo.getAll(),
      this.noticeRepo.getAll()
    ]);

    // Sort tasks: pending first, then by deadline or creation
    const upcomingTasks = [...tasks].sort((a, b) => {
      if (a.status === 'pending' && b.status === 'completed') return -1;
      if (a.status === 'completed' && b.status === 'pending') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Recent notices: sorted newest first
    const recentNotices = [...notices].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      student,
      upcomingTasks,
      opportunities,
      recentNotices
    };
  }
}

export const dashboardService = new DashboardService();
