import fs from 'fs/promises';
import path from 'path';
import { studentRepository } from '../repositories/student.repository';
import { noticeRepository } from '../repositories/notice.repository';
import { opportunityRepository } from '../repositories/opportunity.repository';
import { taskRepository } from '../repositories/task.repository';
import { Student } from '../models/student.model';
import { Notice } from '../models/notice.model';
import { Opportunity } from '../models/opportunity.model';
import { Task } from '../models/task.model';

export const seedStudents: Student[] = [
  {
    id: 'stud-101-aarav-cse',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campus.edu.in',
    year: 3,
    branch: 'Computer Science and Engineering',
    cgpa: 8.85,
    academicInterests: ['Artificial Intelligence', 'Distributed Systems', 'Cloud Computing'],
    placementPreferences: ['Software Development Engineer', 'Full Stack Developer', 'AI/ML Engineer'],
    extracurricularInterests: ['Competitive Coding', 'Robotics Club', 'Hackathons'],
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'stud-102-priya-ece',
    name: 'Priya Patel',
    email: 'priya.patel@campus.edu.in',
    year: 4,
    branch: 'Electronics and Communication Engineering',
    cgpa: 9.15,
    academicInterests: ['Embedded Systems', 'IoT Architecture', 'Signal Processing'],
    placementPreferences: ['Firmware Engineer', 'Core Hardware R&D', 'Systems Engineer'],
    extracurricularInterests: ['IEEE Student Chapter', 'Quiz Club', 'Debate Society'],
    createdAt: '2026-08-01T09:30:00.000Z',
    updatedAt: '2026-09-05T14:20:00.000Z'
  },
  {
    id: 'stud-103-rohan-me',
    name: 'Rohan Verma',
    email: 'rohan.verma@campus.edu.in',
    year: 2,
    branch: 'Mechanical Engineering',
    cgpa: 7.60,
    academicInterests: ['Automotive CAD/CAM', 'Thermal Dynamics', 'Mechatronics'],
    placementPreferences: ['Design Engineer', 'Product Engineering', 'Operations Analyst'],
    extracurricularInterests: ['SAE BAJA Team', 'Sports Committee', 'Cultural Fest Core'],
    createdAt: '2026-08-10T11:15:00.000Z',
    updatedAt: '2026-08-25T16:45:00.000Z'
  }
];

export const seedNotices: Notice[] = [
  {
    id: 'notif-201-placement-msft',
    title: 'Campus Recruitment Drive 2026 - Microsoft SDE & Support Engineering',
    content: 'The Training & Placement Cell (T&P) is pleased to announce the on-campus recruitment drive for Microsoft India. Eligible students from B.Tech 4th Year (CSE, IT, ECE) with CGPA >= 8.00 and no active backlogs may apply. Package: 44 LPA CTC. Online coding assessment will be conducted on 25th September 2026 at 6:00 PM IST. Last date to submit your resume on the Superset T&P portal is 20th September 2026, 11:59 PM.',
    source: 'Training & Placement Cell',
    category: 'placement',
    createdAt: '2026-09-10T08:30:00.000Z',
    updatedAt: '2026-09-10T08:30:00.000Z'
  },
  {
    id: 'notif-202-scholarship-nsp',
    title: 'National Merit-cum-Means Post-Matric Scholarship Scheme 2026-27',
    content: 'Applications are invited from 1st, 2nd, and 3rd-year undergraduate students for the National Scholarship Portal (NSP) Merit-cum-Means Financial Assistance. Annual family income must be below INR 4,50,000 per annum, and candidate must have maintained a minimum of 75% marks / 7.5 CGPA in the preceding academic year. Submit certified income certificate, caste certificate (if applicable), fee receipt, and bank passbook photocopy to Academic Section Counter 3 by 30th September 2026.',
    source: 'Dean of Student Welfare Office',
    category: 'scholarship',
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-08T10:00:00.000Z'
  },
  {
    id: 'notif-203-exam-midsem',
    title: 'Mid-Semester Examinations Schedule - Autumn Semester 2026',
    content: 'All undergraduate students across 1st to 4th year are hereby notified that the Autumn 2026 Mid-Semester Examinations will commence from 12th October 2026 and conclude on 19th October 2026. Hall tickets will be made available on the ERP portal starting 5th October 2026. Minimum 75% attendance is strictly mandatory to be eligible to write the exams. Contact your respective department HOD office for attendance condensation appeals by 3rd October 2026.',
    source: 'Controller of Examinations',
    category: 'examination',
    createdAt: '2026-09-05T12:00:00.000Z',
    updatedAt: '2026-09-05T12:00:00.000Z'
  },
  {
    id: 'notif-204-hackathon-hacksprint',
    title: 'HackSprint 2026 - Inter-College 36-Hour Hackathon & Innovation Summit',
    content: 'The ACM Student Chapter invites multidisciplinary student teams (3-4 members per team) for HackSprint 2026 sponsored by Google Cloud, GitHub, and Devfolio. Tracks include AI & Healthcare, Smart Cities, Decentralized Finance, and CleanTech. Cash prize pool worth INR 2,50,000 + cloud credits. Round 1 abstract submission deadline is 28th September 2026. Shortlisted teams will participate in the offline hackathon on 17th-18th October 2026 at the Main Auditorium.',
    source: 'ACM Student Chapter & Dept. of CSE',
    category: 'event',
    createdAt: '2026-09-02T15:30:00.000Z',
    updatedAt: '2026-09-02T15:30:00.000Z'
  },
  {
    id: 'notif-205-academic-elective',
    title: 'Open Elective & Audit Course Selection for Spring Semester 2027',
    content: 'Students currently in 2nd and 3rd Year must freeze their Open Elective and Audit course preferences for the upcoming Spring 2027 semester on the Academic Portal. Available courses include Applied Machine Learning, Renewable Energy Systems, Financial Engineering, and Technical Writing. Portal opens on 15th September 2026 at 10:00 AM and closes strictly on 22nd September 2026 at 5:00 PM. Allocation is on a first-come, first-served basis according to CGPA.',
    source: 'Dean of Academic Affairs',
    category: 'academic',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z'
  }
];

export const seedOpportunities: Opportunity[] = [
  {
    id: 'opp-301-msft-sde',
    noticeId: 'notif-201-placement-msft',
    title: 'Microsoft India Campus SDE Role',
    category: 'placement',
    description: 'On-campus placement opportunity for 4th-year students with CGPA >= 8.0 for Software Development Engineer role.',
    deadline: '2026-09-20T23:59:59.000Z',
    createdAt: '2026-09-10T08:35:00.000Z',
    updatedAt: '2026-09-10T08:35:00.000Z'
  },
  {
    id: 'opp-302-nsp-scholarship',
    noticeId: 'notif-202-scholarship-nsp',
    title: 'NSP Merit-cum-Means Scholarship Grant',
    category: 'scholarship',
    description: 'Financial assistance grant up to INR 50,000 per year for students with family income < 4.5 LPA and CGPA >= 7.5.',
    deadline: '2026-09-30T17:00:00.000Z',
    createdAt: '2026-09-08T10:05:00.000Z',
    updatedAt: '2026-09-08T10:05:00.000Z'
  },
  {
    id: 'opp-303-hacksprint-hackathon',
    noticeId: 'notif-204-hackathon-hacksprint',
    title: 'HackSprint 2026 Hackathon Team Registration',
    category: 'event',
    description: '36-hour national inter-college hackathon with INR 2.5 Lakh prize pool and internship opportunities.',
    deadline: '2026-09-28T23:59:59.000Z',
    createdAt: '2026-09-02T15:35:00.000Z',
    updatedAt: '2026-09-02T15:35:00.000Z'
  },
  {
    id: 'opp-304-spring27-electives',
    noticeId: 'notif-205-academic-elective',
    title: 'Open Elective Registration Spring 2027',
    category: 'academic',
    description: 'Course selection for Applied ML, Renewable Energy, and Financial Engineering on ERP portal.',
    deadline: '2026-09-22T17:00:00.000Z',
    createdAt: '2026-09-01T09:10:00.000Z',
    updatedAt: '2026-09-01T09:10:00.000Z'
  },
  {
    id: 'opp-305-midsem-exam-admit',
    noticeId: 'notif-203-exam-midsem',
    title: 'Mid-Sem Exam Hall Ticket Download & Attendance Verification',
    category: 'examination',
    description: 'Download verified examination hall tickets for Mid-Semester exams commencing 12th October 2026.',
    deadline: '2026-10-05T23:59:59.000Z',
    createdAt: '2026-09-05T12:05:00.000Z',
    updatedAt: '2026-09-05T12:05:00.000Z'
  }
];

export const seedTasks: Task[] = [
  {
    id: 'task-401-priya-msft-resume',
    studentId: 'stud-102-priya-ece',
    title: 'Submit resume on Superset portal for Microsoft recruitment drive',
    description: 'Upload latest 1-page technical resume and verify 10th/12th/B.Tech percentage records.',
    deadline: '2026-09-20T23:59:59.000Z',
    status: 'pending',
    priority: 'critical',
    sourceNoticeId: 'notif-201-placement-msft',
    createdAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-10T09:00:00.000Z'
  },
  {
    id: 'task-402-priya-msft-prep',
    studentId: 'stud-102-priya-ece',
    title: 'Practice Microsoft online assessment mock questions on LeetCode/HackerRank',
    description: 'Review data structures (Trees, Graphs, DP) and core OS/Networking concepts.',
    deadline: '2026-09-24T18:00:00.000Z',
    status: 'pending',
    priority: 'high',
    sourceNoticeId: 'notif-201-placement-msft',
    createdAt: '2026-09-10T09:15:00.000Z',
    updatedAt: '2026-09-10T09:15:00.000Z'
  },
  {
    id: 'task-403-aarav-hacksprint-abstract',
    studentId: 'stud-101-aarav-cse',
    title: 'Submit team project abstract for HackSprint 2026 AI Track',
    description: 'Finalize architecture diagram and problem statement for Smart Campus AI assistant.',
    deadline: '2026-09-28T23:59:59.000Z',
    status: 'pending',
    priority: 'high',
    sourceNoticeId: 'notif-204-hackathon-hacksprint',
    createdAt: '2026-09-03T11:00:00.000Z',
    updatedAt: '2026-09-03T11:00:00.000Z'
  },
  {
    id: 'task-404-aarav-elective-select',
    studentId: 'stud-101-aarav-cse',
    title: 'Select Open Elective courses on ERP portal',
    description: 'Choose Applied Machine Learning as 1st preference and Financial Engineering as 2nd preference.',
    deadline: '2026-09-22T17:00:00.000Z',
    status: 'pending',
    priority: 'medium',
    sourceNoticeId: 'notif-205-academic-elective',
    createdAt: '2026-09-02T10:00:00.000Z',
    updatedAt: '2026-09-02T10:00:00.000Z'
  },
  {
    id: 'task-405-aarav-cloud-cert',
    studentId: 'stud-101-aarav-cse',
    title: 'Complete Google Cloud Skills Boost lab exercises',
    description: 'Finish Generative AI Fundamentals badge for extra curriculum credits.',
    deadline: '2026-09-30T23:59:59.000Z',
    status: 'completed',
    priority: 'low',
    createdAt: '2026-08-20T14:00:00.000Z',
    updatedAt: '2026-09-01T16:00:00.000Z'
  },
  {
    id: 'task-406-rohan-nsp-income-cert',
    studentId: 'stud-103-rohan-me',
    title: 'Obtain Revenue Department Income Certificate for NSP Scholarship',
    description: 'Collect signed Tehsildar income certificate and photocopy of electricity bill.',
    deadline: '2026-09-25T15:00:00.000Z',
    status: 'pending',
    priority: 'critical',
    sourceNoticeId: 'notif-202-scholarship-nsp',
    createdAt: '2026-09-08T11:30:00.000Z',
    updatedAt: '2026-09-08T11:30:00.000Z'
  },
  {
    id: 'task-407-rohan-baja-cad',
    studentId: 'stud-103-rohan-me',
    title: 'Finish suspension CAD modeling for SAE BAJA vehicle',
    description: 'Run SolidWorks FEA simulations for double wishbone suspension arm.',
    deadline: '2026-10-01T18:00:00.000Z',
    status: 'pending',
    priority: 'medium',
    createdAt: '2026-08-28T16:00:00.000Z',
    updatedAt: '2026-08-28T16:00:00.000Z'
  },
  {
    id: 'task-408-priya-library-return',
    studentId: 'stud-102-priya-ece',
    title: 'Renew/Return Embedded Systems reference textbook to Central Library',
    description: 'Book title: "Embedded Systems Architecture" by Tammy Noergaard.',
    deadline: '2026-09-18T16:30:00.000Z',
    status: 'completed',
    priority: 'low',
    createdAt: '2026-09-04T12:00:00.000Z',
    updatedAt: '2026-09-09T15:00:00.000Z'
  }
];

export async function seedDatabase(customDataDir?: string): Promise<void> {
  const dir = customDataDir || path.resolve(process.cwd(), 'data');
  await fs.mkdir(dir, { recursive: true });

  const sRepo = customDataDir ? new (studentRepository.constructor as any)(customDataDir) : studentRepository;
  const nRepo = customDataDir ? new (noticeRepository.constructor as any)(customDataDir) : noticeRepository;
  const oRepo = customDataDir ? new (opportunityRepository.constructor as any)(customDataDir) : opportunityRepository;
  const tRepo = customDataDir ? new (taskRepository.constructor as any)(customDataDir) : taskRepository;

  await sRepo.clear();
  await nRepo.clear();
  await oRepo.clear();
  await tRepo.clear();

  for (const s of seedStudents) {
    await sRepo.create(s);
  }

  for (const n of seedNotices) {
    await nRepo.create(n);
  }

  for (const o of seedOpportunities) {
    await oRepo.create(o);
  }

  for (const t of seedTasks) {
    await tRepo.create(t);
  }

  console.log(`✅ Database successfully seeded at ${dir}!`);
  console.log(`   - Students: ${seedStudents.length}`);
  console.log(`   - Notices: ${seedNotices.length}`);
  console.log(`   - Opportunities: ${seedOpportunities.length}`);
  console.log(`   - Tasks: ${seedTasks.length}`);
}

// Execute directly if run via CLI
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed database:', err);
      process.exit(1);
    });
}
