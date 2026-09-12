/**
 * Mock Data for AlexandarTheGreat — Smart Campus AI
 * Formatted exactly per Section 4 data model specifications.
 */

export const INITIAL_STUDENT_PROFILE = {
  id: "std-101",
  name: "Alexandar R.",
  rollNumber: "2024CSE042",
  year: 1, // 1st year engineering student
  branch: "CSE",
  email: "alexandar.r@campus.edu",
  interests: ["Artificial Intelligence", "Web Development", "Competitive Programming", "Robotics"],
  placementPrefs: ["Software Engineering", "Data Science", "Core Tech", "Product Management"],
};

export const INITIAL_NOTICES = [
  {
    id: "not-001",
    title: "TCS National Qualifier Test (NQT) 2026 Registration",
    rawText: `OFFICE OF PLACEMENT & TRAINING
CIRCULAR NO: TPO/2026/089

Subject: TCS NQT 2026 Registration for 1st, 2nd, 3rd, and 4th Year Students

All B.Tech students across Computer Science (CSE), Electronics (ECE), and Information Technology (IT) with an aggregate CGPA > 6.5 and no active backlogs are eligible to register for the TCS NQT 2026. 

Key Details:
- Registration Portal Closes: Today at 6:00 PM IST sharp.
- Drive Dates: October 15-18, 2026.
- Role Packages: Ninja (3.6 LPA), Digital (7.0 LPA), Prime (9.0 LPA).

Mandatory Action: Complete registration on the official TCS iON portal and upload your hall ticket link to the college TPO dashboard before 18:00 hrs today. Late submissions will result in immediate disqualification for campus interviews.`,
    category: "placement",
    deadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(), // Today (in 6 hrs)
    eligibility: ["1st year", "2nd year", "3rd year", "4th year", "CSE", "ECE", "IT", "CGPA > 6.5"],
    requiredAction: "Register on TCS iON portal & upload confirmation link before 6:00 PM today",
    department: "Training & Placement Cell",
    urgency: "urgent", // urgent
    relevanceScore: 0.95,
    createdAt: "2026-09-12T08:00:00Z"
  },
  {
    id: "not-002",
    title: "End Semester Examinations Nov 2026 — Timetable & Fee Payment",
    rawText: `CONTROLLER OF EXAMINATIONS
REF: COE/EXAM/2026/11-04

Notice: End-Semester Theory & Practical Examination Schedule & Mandatory Fee Submission

Students of all years (B.Tech 1st to 4th Year) are hereby informed that the Odd Semester Examinations will commence on November 3, 2026.

Important Instructions:
1. Examination Fee Payment Deadline: Tomorrow at 23:59 IST via Student Portal.
2. Fine of ₹500 per day applicable post deadline.
3. Hall tickets will be issued only to students with >= 75% attendance and no pending dues.
4. Verify your course codes in the published draft timetable immediately.`,
    category: "exam",
    deadline: new Date(Date.now() + 28 * 3600 * 1000).toISOString(), // Tomorrow
    eligibility: ["1st year", "2nd year", "3rd year", "4th year", "All Branches"],
    requiredAction: "Pay exam fee ₹1,850 on Student Portal to unlock Hall Ticket",
    department: "Office of the Controller of Examinations",
    urgency: "urgent", // urgent
    relevanceScore: 0.90,
    createdAt: "2026-09-11T10:00:00Z"
  },
  {
    id: "not-003",
    title: "Reliance Foundation Undergraduate Scholarship 2026-27",
    rawText: `DEAN STUDENT AFFAIRS
REF: DSA/SCH/2026/014

Subject: Reliance Foundation Scholarship for 1st Year Engineering Students

Applications are invited for the prestigious Reliance Foundation Undergraduate Scholarship offering up to ₹2,00,000 grant over the degree duration.

Eligibility Criteria:
- First-year full-time B.Tech/BE students (Passout Batch 2028).
- Household annual income under ₹15 Lakhs (Preference to < ₹2.5 Lakhs).
- Minimum 75% marks in Class 12th Board Examinations.

Deadline: October 6, 2026 (In 4 days).
Action Item: Fill online application form, attach Class 12 marksheets, income certificate, and submit copy to Dean Student Affairs Office.`,
    category: "scholarship",
    deadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(), // 4 days (This week)
    eligibility: ["1st year", "All Branches", "12th Marks > 75%", "Income < 15L"],
    requiredAction: "Submit online application with Class 12 Marksheet & Income Certificate",
    department: "Dean of Student Affairs",
    urgency: "soon", // soon
    relevanceScore: 0.88,
    createdAt: "2026-09-10T14:30:00Z"
  },
  {
    id: "not-004",
    title: "HackCampus 2026: 24-Hour AI & Web Hackathon Registration",
    rawText: `DEPARTMENT OF COMPUTER SCIENCE & ACM STUDENT CHAPTER
ANNOUNCEMENT: HACKCAMPUS '26

Theme: Building Autonomous AI Assistants for Smart Campuses & Urban Mobility.

We welcome all B.Tech students (1st - 4th Year) to participate in HackCampus 2026! Cash prizes worth ₹1,50,000 + Internship offers from partner tech startups.

Event Details:
- Registration Deadline: October 8, 2026.
- Event Date: October 18-19, 2026 (Campus Innovation Hub).
- Team size: 2 to 4 members.

Prerequisites: Basic Web Dev, Python, or AI concepts. Mentors will be provided on site.`,
    category: "event",
    deadline: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(), // 6 days (This week)
    eligibility: ["1st year", "2nd year", "3rd year", "4th year", "CSE", "IT", "ECE"],
    requiredAction: "Form a team of 2-4 members & register team lead details on Unstop",
    department: "Department of CSE",
    urgency: "soon", // soon
    relevanceScore: 0.92,
    createdAt: "2026-09-09T11:15:00Z"
  },
  {
    id: "not-005",
    title: "Google Developer Student Club (GDSC) Core Team Recruitment",
    rawText: `GDSC CAMPUS CHAPTER
RECRUITMENT NOTICE 2026

GDSC is hiring Core Team Leads and Contributors for the 2026-27 Academic Session!

Open Domains:
1. AI/ML Lead
2. Web Development Lead (React/Next.js)
3. Competitive Programming Coordinator
4. Design & Media Lead

Eligibility: 1st Year and 2nd Year B.Tech students of CSE, IT, and ECE.
Application Closes: October 12, 2026.
Interview Schedule: October 14-15, 2026.`,
    category: "club",
    deadline: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(), // 10 days (Later)
    eligibility: ["1st year", "2nd year", "CSE", "IT", "ECE"],
    requiredAction: "Submit GitHub/Portfolio link via GDSC Google Form",
    department: "Student Activity Center",
    urgency: "later", // later
    relevanceScore: 0.85,
    createdAt: "2026-09-08T16:00:00Z"
  },
  {
    id: "not-006",
    title: "Mandatory Hostel Inspection & Biometric Re-registration",
    rawText: `CHIEF WARDEN OFFICE
CIRCULAR NO: CWO/2026/HOSTEL/12

All resident hostel students (Block A, B, C & D) are directed to complete their biometric verification update at the Central Security Gate office.

Timings: 09:00 AM to 05:00 PM on weekdays.
Deadline: October 14, 2026.
Failure to update biometrics will lead to restriction of night out passes and hostel mess entry after October 15.`,
    category: "administrative",
    deadline: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString(), // 12 days
    eligibility: ["Hostel Residents", "All Years"],
    requiredAction: "Visit Security Gate with Student ID for biometric thumb scan",
    department: "Office of Chief Warden",
    urgency: "later",
    relevanceScore: 0.60,
    createdAt: "2026-09-07T09:00:00Z"
  },
  {
    id: "not-007",
    title: "Texas Instruments (TI) Embedded & AI Hardware Internship",
    rawText: `TRAINING & PLACEMENT CELL
OPPORTUNITY CODE: TPO/2026/TI-03

Texas Instruments is opening applications for Summer 2027 R&D Internships.

Eligible Branches: 2nd & 3rd Year ECE, EEE, and CSE students.
Pre-requisites: Minimum CGPA 7.5, knowledge of C/C++, Microcontrollers, or Embedded Linux.
Stipend: ₹65,000 / month.
Registration Deadline: October 15, 2026.`,
    category: "placement",
    deadline: new Date(Date.now() + 13 * 24 * 3600 * 1000).toISOString(),
    eligibility: ["2nd year", "3rd year", "ECE", "EEE", "CSE", "CGPA > 7.5"],
    requiredAction: "Upload updated Resume & Transcripts to TPO Portal",
    department: "Training & Placement Cell",
    urgency: "later",
    relevanceScore: 0.78,
    createdAt: "2026-09-06T12:00:00Z"
  },
  {
    id: "not-008",
    title: "Mid-Term Attendance Defaulters List & Parent-Teacher Meeting",
    rawText: `ACADEMIC AFFAIRS OFFICE
NOTICE: ATTENDANCE SHORTAGE WARNING

Students having less than 75% aggregate attendance in Odd Semester subjects as of September 30, 2026 have been flagged.

Mandatory Action: Flagged students must submit a medical certificate or valid representation letter countersigned by HOD before October 5, 2026. Parent-Teacher meetings scheduled for October 7.`,
    category: "administrative",
    deadline: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    eligibility: ["Attendance < 75%", "All Years", "All Branches"],
    requiredAction: "Check defaulter PDF on intranet and submit medical/undertaking if flagged",
    department: "Dean of Academic Affairs",
    urgency: "soon",
    relevanceScore: 0.50,
    createdAt: "2026-09-05T15:20:00Z"
  },
  {
    id: "not-009",
    title: "L&T Build India Scholarship 2027 — M.Tech Sponsorship",
    rawText: `DEAN R&D AND PLACEMENT
SPONSORSHIP NOTICE: L&T BIS 2027

Larsen & Toubro (L&T) invites applications from final year Civil, Electrical, and Mechanical engineering students for the Build India Scholarship scheme (2-year sponsored M.Tech at IIT Madras / IIT Delhi + Job Placement).

Application Deadline: October 20, 2026.`,
    category: "scholarship",
    deadline: new Date(Date.now() + 18 * 24 * 3600 * 1000).toISOString(),
    eligibility: ["4th year", "Civil", "Electrical", "Mechanical"],
    requiredAction: "Register on L&T Careers portal",
    department: "Training & Placement Cell",
    urgency: "later",
    relevanceScore: 0.20, // Low relevance for 1st year CSE student
    createdAt: "2026-09-04T10:00:00Z"
  },
  {
    id: "not-010",
    title: "Robotics Club 'RoboWars 2026' Workshop & Kit Distribution",
    rawText: `STUDENT ROBOTICS SOCIETY
WORKSHOP ANNOUNCEMENT

Learn Arduino, ESP32, ROS, and Bot chassis fabrication in a hands-on 3-day weekend bootcamp!

Kit fee: ₹450 per head (includes microcontroller board and sensor kit).
Event Dates: October 10-12, 2026.
Deadline to register & pay kit fee: October 7, 2026.`,
    category: "club",
    deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    eligibility: ["1st year", "2nd year", "3rd year", "All Branches"],
    requiredAction: "Pay kit fee ₹450 at SAC Counter #3 and collect receipt",
    department: "Student Activity Center",
    urgency: "soon",
    relevanceScore: 0.89,
    createdAt: "2026-09-03T11:00:00Z"
  }
];

export const INITIAL_TASKS = [
  {
    id: "task-001",
    noticeId: "not-001",
    title: "Complete TCS NQT iON Portal Registration",
    dueDate: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    status: "pending",
    category: "placement"
  },
  {
    id: "task-002",
    noticeId: "not-002",
    title: "Pay Odd Semester Examination Fee (₹1,850)",
    dueDate: new Date(Date.now() + 28 * 3600 * 1000).toISOString(),
    status: "pending",
    category: "exam"
  },
  {
    id: "task-003",
    noticeId: "not-003",
    title: "Collect Class 12 Marksheet for Reliance Scholarship",
    dueDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    status: "pending",
    category: "scholarship"
  },
  {
    id: "task-004",
    noticeId: "not-004",
    title: "Form team for HackCampus '26 Hackathon",
    dueDate: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    status: "done",
    category: "event"
  },
  {
    id: "task-005",
    noticeId: "not-005",
    title: "Prepare GitHub Portfolio for GDSC Lead Application",
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    status: "dismissed",
    category: "club"
  }
];
