# AlexandarTheGreat Backend — Complete API Specification

This specification defines the complete REST API contract for the **AlexandarTheGreat** backend (Phases 1 through 5). The frontend team can build UI components, hooks, dashboards, and agent chat interfaces directly against this contract without inspecting backend source code.

---

## 1. Global Conventions

### Base URL
```
http://localhost:5001
```

### Headers
- `Content-Type: application/json`
- `Accept: application/json`

### Standard Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": ...
}
```

#### Error Envelope (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`, `503 Service Unavailable`)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

---

## 2. Health & Diagnostic Endpoints

### `GET /health`
Returns the operational health and identity of the backend service.

- **Status**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "AlexandarTheGreat Backend"
  }
}
```

---

## 3. Student Profile Endpoints

### `GET /api/students`
Fetches a list of all registered students.

- **Status**: `200 OK`

---

### `GET /api/students/:id`
Fetches a single student profile by ID.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `POST /api/students`
Creates a new student profile.

- **Status**: `201 Created` (or `400 Bad Request`)
- **Example Request**:
```json
{
  "name": "Sneha Rao",
  "email": "sneha.rao@campus.edu.in",
  "year": 3,
  "branch": "Information Technology",
  "cgpa": 8.92,
  "academicInterests": ["Cybersecurity", "Distributed Systems"],
  "placementPreferences": ["Security Engineer", "DevOps Specialist"],
  "extracurricularInterests": ["CTF Team", "Debate Club"]
}
```

---

### `PATCH /api/students/:id`
Updates fields in an existing student profile.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `DELETE /api/students/:id`
Deletes a student profile.

- **Status**: `200 OK` (or `404 Not Found`)

---

## 4. Notice & AI Notice Intelligence Endpoints

### `GET /api/notices`
Retrieves all raw campus notices.

- **Status**: `200 OK`

---

### `GET /api/notices/:id`
Retrieves a specific notice by ID.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `POST /api/notices`
Stores a new raw notice.

- **Status**: `201 Created` (or `400 Bad Request`)

---

### `POST /api/notices/analyze` (NVIDIA NIM AI Notice Intelligence)
Ingests raw college notice text, uses NVIDIA NIM to perform structured extraction, auto-persists the notice and opportunity, and (if `studentId` is provided) evaluates student eligibility and relevance.

- **Status**: `201 Created` (or `400 Bad Request`, `503 NIM_API_ERROR`)
- **Example Request**:
```json
{
  "content": "The Training & Placement Cell is pleased to announce the on-campus recruitment drive for Microsoft India. Eligible students from B.Tech 4th Year (CSE, IT, ECE) with CGPA >= 8.00 and no active backlogs may apply. Package: 44 LPA CTC. Online coding assessment will be conducted on 25th September 2026. Last date to submit resume on Superset portal is 20th September 2026.",
  "studentId": "stud-101-aarav-cse"
}
```
- **Example Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "notice": {
      "id": "c71e8437-0cf1-450f-a496-d249f1dbfa29",
      "title": "Microsoft India Campus Recruitment Drive",
      "content": "The Training & Placement Cell is pleased to announce...",
      "category": "placement",
      "source": "4th Year Undergraduates (CSE, IT, ECE)",
      "createdAt": "2026-09-12T10:30:00.000Z",
      "updatedAt": "2026-09-12T10:30:00.000Z"
    },
    "opportunity": {
      "id": "e229c719-75ea-44a6-9818-5ecf36f6d0f9",
      "noticeId": "c71e8437-0cf1-450f-a496-d249f1dbfa29",
      "title": "Microsoft India Campus Recruitment Drive",
      "category": "placement",
      "description": "On-campus placement drive for 4th year CSE, IT, ECE with CGPA >= 8.0.",
      "deadline": "2026-09-20T23:59:59.000Z",
      "createdAt": "2026-09-12T10:30:00.000Z",
      "updatedAt": "2026-09-12T10:30:00.000Z"
    },
    "extracted": {
      "title": "Microsoft India Campus Recruitment Drive",
      "category": "placement",
      "summary": "On-campus placement drive for Microsoft India offering 44 LPA CTC for 4th-year students.",
      "deadline": "2026-09-20T23:59:59.000Z",
      "eligibility": {
        "branches": ["CSE", "IT", "ECE"],
        "years": [4],
        "minCGPA": 8.0
      },
      "actions": [
        "Submit resume on Superset portal by 20th September 2026",
        "Attend online coding assessment on 25th September 2026"
      ],
      "targetGroups": ["4th Year Undergraduates (CSE, IT, ECE)"]
    },
    "evaluation": {
      "eligible": true,
      "relevanceScore": 94,
      "priority": "critical",
      "reason": "You are a Year 4 Computer Science and Engineering student with a CGPA of 8.85. You meet all stated eligibility criteria and aligns with your interest in Artificial Intelligence, Distributed Systems. Recommended Priority: CRITICAL (94/100 relevance score)."
    }
  }
}
```

---

## 5. Opportunity & Eligibility Evaluation Endpoints

### `GET /api/opportunities`
Retrieves all opportunities.

- **Status**: `200 OK`

---

### `GET /api/opportunities/:id`
Retrieves an opportunity by ID.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `GET /api/opportunities/:id/evaluate/:studentId` (or `POST`)
Evaluates student eligibility, calculates 100-point relevance score, and determines task priority level.

- **Status**: `200 OK` (or `404 Not Found`)
- **Example Response (200)**:
```json
{
  "success": true,
  "data": {
    "opportunity": {
      "id": "opp-301-msft-sde",
      "title": "Microsoft India Campus SDE Role",
      "category": "placement",
      "deadline": "2026-09-20T23:59:59.000Z"
    },
    "evaluation": {
      "eligible": true,
      "relevanceScore": 88,
      "priority": "high",
      "reason": "You are a Year 4 Electronics and Communication Engineering student with a CGPA of 9.15. You meet all stated eligibility criteria. Recommended Priority: HIGH (88/100 relevance score)."
    }
  }
}
```

---

## 6. Task Management & Automated Generation Endpoints

### `GET /api/tasks`
Retrieves all tasks across the system.

- **Status**: `200 OK`

---

### `GET /api/tasks/student/:studentId`
Retrieves all tasks assigned to a specific student.

- **Status**: `200 OK`

---

### `POST /api/tasks`
Manually creates a task for a student.

- **Status**: `201 Created`

---

### `POST /api/tasks/from-notice`
Generates actionable tasks for a student directly from an ingested notice's action items and assigns personalized priority.

- **Status**: `201 Created` (or `404 Not Found`)
- **Example Request**:
```json
{
  "noticeId": "notif-201-placement-msft",
  "studentId": "stud-102-priya-ece"
}
```
- **Example Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "6732cf05-4c01-4475-8025-a134a4d62329",
        "studentId": "stud-102-priya-ece",
        "title": "Last date to submit your resume on the Superset T&P portal is 20th September 2026, 11:59 PM",
        "description": "Action item generated from notice: Campus Recruitment Drive 2026 - Microsoft SDE & Support Engineering",
        "deadline": "2026-09-20T23:59:59.000Z",
        "status": "pending",
        "priority": "high",
        "sourceNoticeId": "notif-201-placement-msft",
        "createdAt": "2026-09-12T10:35:00.000Z",
        "updatedAt": "2026-09-12T10:35:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

## 7. Google Calendar Integration Endpoint

### `POST /api/calendar/create`
Creates a Google Calendar event for an actionable task deadline. Gracefully responds with configuration instructions if Google credentials are not set.

- **Status**: `200 OK` (or `404 Not Found` if taskId missing)
- **Example Request**:
```json
{
  "taskId": "task-401-priya-msft-resume"
}
```
- **Example Response (When Unconfigured - Safe Fallback)**:
```json
{
  "success": true,
  "data": {
    "status": "unconfigured",
    "configured": false,
    "message": "Google Calendar API credentials are not configured in backend/.env. Task deadline remains actively tracked in your Smart Campus local planner.",
    "task": {
      "id": "task-401-priya-msft-resume",
      "title": "Submit resume on Superset portal for Microsoft recruitment drive",
      "deadline": "2026-09-20T23:59:59.000Z"
    }
  }
}
```

---

## 8. Consolidated Student Dashboard

### `GET /api/dashboard/:studentId`
Returns an aggregated campus view for the student (profile, upcoming tasks, opportunities, recent notices).

- **Status**: `200 OK` (or `404 Not Found`)
- **Example Request**:
```http
GET /api/dashboard/stud-101-aarav-cse HTTP/1.1
Host: localhost:5001
```

---

## 9. Campus AI Agent Chat Endpoint

### `POST /api/agent/chat` (NVIDIA NIM Tool-Calling Agent)
Natural-language conversational campus agent powered by NVIDIA NIM. Automatically decides when to call backend tools to fetch real student profiles, upcoming tasks, opportunities, and eligibility evaluations.

- **Status**: `200 OK` (or `400 Bad Request`, `503 NIM_API_ERROR`)
- **Example Request 1**:
```json
{
  "studentId": "stud-101-aarav-cse",
  "message": "What do I need to complete this week?"
}
```
- **Example Response 1**:
```json
{
  "success": true,
  "data": {
    "message": "Hi Aarav! You have 2 pending tasks upcoming:\n1. **Submit team project abstract for HackSprint 2026 AI Track** (Deadline: 28th September 2026 - High Priority)\n2. **Select Open Elective courses on ERP portal** (Deadline: 22nd September 2026 - Medium Priority)\n\nYou have also completed your Google Cloud Skills Boost lab exercises!",
    "toolCallsExecuted": [
      {
        "tool": "get_upcoming_tasks",
        "args": { "studentId": "stud-101-aarav-cse" },
        "result": { "total": 3 }
      }
    ]
  }
}
```

- **Example Request 2**:
```json
{
  "studentId": "stud-101-aarav-cse",
  "message": "Which placement opportunities am I eligible for?"
}
```
- **Example Response 2**:
```json
{
  "success": true,
  "data": {
    "message": "Based on your student profile (Year 3 CSE, 8.85 CGPA), here are your opportunities:\n- **Microsoft India Campus SDE Role**: On-campus drive with deadline on 20th September 2026.",
    "toolCallsExecuted": [
      {
        "tool": "get_student_profile",
        "args": { "studentId": "stud-101-aarav-cse" },
        "result": { "id": "stud-101-aarav-cse", "name": "Aarav Sharma", "year": 3, "cgpa": 8.85 }
      },
      {
        "tool": "search_opportunities",
        "args": { "category": "placement" },
        "result": { "total": 1 }
      }
    ]
  }
}
```
