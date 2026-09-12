import { Student } from './student.model';
import { Task } from './task.model';
import { Opportunity } from './opportunity.model';
import { Notice } from './notice.model';

export interface DashboardData {
  student: Student;
  upcomingTasks: Task[];
  opportunities: Opportunity[];
  recentNotices: Notice[];
}
