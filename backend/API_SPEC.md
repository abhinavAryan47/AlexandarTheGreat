# AlexandarTheGreat Backend — API Specification (Phase 1)

This specification defines the complete REST API contract for the **AlexandarTheGreat** backend. The frontend team can build UI components, hooks, and services directly against this specification without needing to read backend implementation code.

---

## 1. Global Conventions

### Base URL
```
http://localhost:5001
```

### Headers
- `Content-Type: application/json` (for all POST/PATCH requests)
- `Accept: application/json`

### Standard Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "data": ...
}
```

#### Error Envelope (`400 Bad Request`, `404 Not Found`, `500 Internal Server Error`)
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
- **Request Body**: None
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

### Data Model: `Student`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique student identifier |
| `name` | string | Full name of the student |
| `email` | string | University email address |
| `year` | number (1-5) | Current academic year |
| `branch` | string | Academic discipline/department |
| `cgpa` | number (0.0-10.0) | Cumulative Grade Point Average |
| `academicInterests` | string[] | Core technical/academic fields of interest |
| `placementPreferences` | string[] | Preferred career/job profiles |
| `extracurricularInterests` | string[] | Clubs, sports, societies |
| `createdAt` | string (ISO 8601) | Record creation timestamp |
| `updatedAt` | string (ISO 8601) | Record last update timestamp |

---

### `GET /api/students`
Fetches a list of all registered students.

- **Status**: `200 OK`
- **Request Body**: None
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "stud-101-aarav-cse",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu.in",
      "year": 3,
      "branch": "Computer Science and Engineering",
      "cgpa": 8.85,
      "academicInterests": ["Artificial Intelligence", "Cloud Computing"],
      "placementPreferences": ["Software Development Engineer"],
      "extracurricularInterests": ["Competitive Coding", "Hackathons"],
      "createdAt": "2026-08-01T09:00:00.000Z",
      "updatedAt": "2026-09-01T10:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/students/:id`
Fetches a single student profile by ID.

- **Path Parameters**:
  - `id` (string, required): Student ID
- **Status**: `200 OK` (or `404 Not Found`)
- **Example Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "stud-101-aarav-cse",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@campus.edu.in",
    "year": 3,
    "branch": "Computer Science and Engineering",
    "cgpa": 8.85,
    "academicInterests": ["Artificial Intelligence", "Cloud Computing"],
    "placementPreferences": ["Software Development Engineer"],
    "extracurricularInterests": ["Competitive Coding", "Hackathons"],
    "createdAt": "2026-08-01T09:00:00.000Z",
    "updatedAt": "2026-09-01T10:00:00.000Z"
  }
}
```
- **Example Response (404)**:
```json
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student with id non-existent-id not found"
  }
}
```

---

### `POST /api/students`
Creates a new student profile.

- **Status**: `201 Created` (or `400 Bad Request`)
- **Example Request Body**:
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
- **Example Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "8f8b83e6-0562-430c-be4e-fc9c8dbecfb7",
    "name": "Sneha Rao",
    "email": "sneha.rao@campus.edu.in",
    "year": 3,
    "branch": "Information Technology",
    "cgpa": 8.92,
    "academicInterests": ["Cybersecurity", "Distributed Systems"],
    "placementPreferences": ["Security Engineer", "DevOps Specialist"],
    "extracurricularInterests": ["CTF Team", "Debate Club"],
    "createdAt": "2026-09-12T10:00:00.000Z",
    "updatedAt": "2026-09-12T10:00:00.000Z"
  }
}
```
- **Example Response (400 Validation Error)**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request body",
    "details": [
      { "field": "email", "message": "Invalid email address" },
      { "field": "cgpa", "message": "CGPA cannot exceed 10.0" }
    ]
  }
}
```

---

### `PATCH /api/students/:id`
Updates fields in an existing student profile.

- **Path Parameters**:
  - `id` (string, required): Student ID
- **Request Body**: Partial<Student> (any subset of student fields)
- **Status**: `200 OK` (or `404 Not Found` / `400 Bad Request`)
- **Example Request Body**:
```json
{
  "cgpa": 9.1,
  "placementPreferences": ["Senior SDE", "AI Research Scientist"]
}
```
- **Example Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "stud-101-aarav-cse",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@campus.edu.in",
    "year": 3,
    "branch": "Computer Science and Engineering",
    "cgpa": 9.1,
    "academicInterests": ["Artificial Intelligence", "Cloud Computing"],
    "placementPreferences": ["Senior SDE", "AI Research Scientist"],
    "extracurricularInterests": ["Competitive Coding", "Hackathons"],
    "createdAt": "2026-08-01T09:00:00.000Z",
    "updatedAt": "2026-09-12T10:05:00.000Z"
  }
}
```

---

### `DELETE /api/students/:id`
Deletes a student profile.

- **Path Parameters**:
  - `id` (string, required): Student ID
- **Status**: `200 OK` (or `404 Not Found`)
- **Example Response (200)**:
```json
{
  "success": true,
  "data": {
    "message": "Student stud-101-aarav-cse deleted successfully"
  }
}
```

---

## 4. Notice Endpoints

### Data Model: `Notice`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique notice identifier |
| `title` | string | Heading/Title of the notice |
| `content` | string | Full raw circular / notice text |
| `source` | string (optional) | Issuing department or authority |
| `category` | string (optional) | Category (`placement`, `scholarship`, `examination`, `academic`, `event`, `club`) |
| `createdAt` | string (ISO 8601) | Notice publication timestamp |
| `updatedAt` | string (ISO 8601) | Notice last update timestamp |

---

### `GET /api/notices`
Retrieves all raw campus notices.

- **Status**: `200 OK`
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-201-placement-msft",
      "title": "Campus Recruitment Drive 2026 - Microsoft SDE",
      "content": "The T&P Cell announces recruitment for Microsoft India...",
      "source": "Training & Placement Cell",
      "category": "placement",
      "createdAt": "2026-09-10T08:30:00.000Z",
      "updatedAt": "2026-09-10T08:30:00.000Z"
    }
  ]
}
```

---

### `GET /api/notices/:id`
Retrieves a specific notice by ID.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `POST /api/notices`
Stores a new raw notice.

- **Status**: `201 Created` (or `400 Bad Request`)
- **Example Request Body**:
```json
{
  "title": "ACM Winter Coding Camp 2026",
  "content": "Registrations are open for the 7-day intensive Data Structures and Algorithms bootcamp...",
  "source": "ACM Student Chapter",
  "category": "club"
}
```
- **Example Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "notice-uuid-1234",
    "title": "ACM Winter Coding Camp 2026",
    "content": "Registrations are open for the 7-day intensive Data Structures and Algorithms bootcamp...",
    "source": "ACM Student Chapter",
    "category": "club",
    "createdAt": "2026-09-12T10:10:00.000Z",
    "updatedAt": "2026-09-12T10:10:00.000Z"
  }
}
```

---

### `PATCH /api/notices/:id`
Updates notice fields.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `DELETE /api/notices/:id`
Deletes a notice.

- **Status**: `200 OK` (or `404 Not Found`)

---

## 5. Opportunity Endpoints

### Data Model: `Opportunity`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique opportunity identifier |
| `noticeId` | string | ID of the source notice |
| `title` | string | Opportunity title |
| `category` | string | `placement`, `scholarship`, `event`, `academic`, `competition` |
| `description` | string (optional) | Summary description |
| `deadline` | string (optional, ISO 8601) | Application/registration deadline |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

---

### `GET /api/opportunities`
Retrieves all opportunities.

- **Status**: `200 OK`

---

### `GET /api/opportunities/:id`
Retrieves a single opportunity by ID.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `POST /api/opportunities`
Creates an opportunity linked to a notice.

- **Status**: `201 Created` (or `400 Bad Request`)
- **Example Request Body**:
```json
{
  "noticeId": "notif-201-placement-msft",
  "title": "Microsoft SDE Full-Time Role",
  "category": "placement",
  "description": "Full-time SDE role for 4th year CSE/IT/ECE students.",
  "deadline": "2026-09-20T23:59:59.000Z"
}
```

---

### `PATCH /api/opportunities/:id`
Updates an opportunity.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `DELETE /api/opportunities/:id`
Deletes an opportunity.

- **Status**: `200 OK` (or `404 Not Found`)

---

## 6. Task Management Endpoints

### Data Model: `Task`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | string (UUID) | Unique task identifier |
| `studentId` | string | ID of student this task belongs to |
| `title` | string | Actionable task title |
| `description` | string (optional) | Detailed action steps / guidelines |
| `deadline` | string (optional, ISO 8601) | Due date/time |
| `status` | `"pending"` \| `"completed"` | Task completion status |
| `priority` | `"low"` \| `"medium"` \| `"high"` \| `"critical"` (optional) | Task urgency |
| `sourceNoticeId` | string (optional) | Reference notice ID if created from a notice |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

---

### `GET /api/tasks`
Retrieves all tasks across the system.

- **Status**: `200 OK`

---

### `GET /api/tasks/:id`
Retrieves a single task by ID.

- **Status**: `200 OK` (or `404 Not Found`)

---

### `GET /api/tasks/student/:studentId`
Retrieves all tasks assigned to a specific student.

- **Path Parameters**:
  - `studentId` (string, required): Student ID
- **Status**: `200 OK`
- **Example Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "task-403-aarav-hacksprint-abstract",
      "studentId": "stud-101-aarav-cse",
      "title": "Submit team project abstract for HackSprint 2026 AI Track",
      "description": "Finalize architecture diagram and problem statement.",
      "deadline": "2026-09-28T23:59:59.000Z",
      "status": "pending",
      "priority": "high",
      "sourceNoticeId": "notif-204-hackathon-hacksprint",
      "createdAt": "2026-09-03T11:00:00.000Z",
      "updatedAt": "2026-09-03T11:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/tasks`
Creates a task for a student.

- **Status**: `201 Created` (or `400 Bad Request`)
- **Example Request Body**:
```json
{
  "studentId": "stud-101-aarav-cse",
  "title": "Submit assignment on Kubernetes Pod Networking",
  "description": "Upload PDF to Google Classroom assignment folder.",
  "deadline": "2026-09-25T18:00:00.000Z",
  "status": "pending",
  "priority": "medium"
}
```
- **Example Response (201)**:
```json
{
  "success": true,
  "data": {
    "id": "task-uuid-5678",
    "studentId": "stud-101-aarav-cse",
    "title": "Submit assignment on Kubernetes Pod Networking",
    "description": "Upload PDF to Google Classroom assignment folder.",
    "deadline": "2026-09-25T18:00:00.000Z",
    "status": "pending",
    "priority": "medium",
    "createdAt": "2026-09-12T10:15:00.000Z",
    "updatedAt": "2026-09-12T10:15:00.000Z"
  }
}
```

---

### `PATCH /api/tasks/:id`
Updates task status, priority, or content.

- **Status**: `200 OK` (or `404 Not Found`)
- **Example Request Body**:
```json
{
  "status": "completed"
}
```

---

### `DELETE /api/tasks/:id`
Deletes a task.

- **Status**: `200 OK` (or `404 Not Found`)

---

## 7. Consolidated Dashboard Endpoint

### `GET /api/dashboard/:studentId`
Provides a single aggregated view containing student information, upcoming tasks, opportunities, and recent campus notices.

- **Path Parameters**:
  - `studentId` (string, required): Student ID
- **Status**: `200 OK` (or `404 Not Found` if student does not exist)
- **Example Request**:
```http
GET /api/dashboard/stud-101-aarav-cse HTTP/1.1
Host: localhost:5001
```
- **Example Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "stud-101-aarav-cse",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu.in",
      "year": 3,
      "branch": "Computer Science and Engineering",
      "cgpa": 8.85,
      "academicInterests": ["Artificial Intelligence", "Distributed Systems", "Cloud Computing"],
      "placementPreferences": ["Software Development Engineer", "Full Stack Developer", "AI/ML Engineer"],
      "extracurricularInterests": ["Competitive Coding", "Robotics Club", "Hackathons"],
      "createdAt": "2026-08-01T09:00:00.000Z",
      "updatedAt": "2026-09-01T10:00:00.000Z"
    },
    "upcomingTasks": [
      {
        "id": "task-403-aarav-hacksprint-abstract",
        "studentId": "stud-101-aarav-cse",
        "title": "Submit team project abstract for HackSprint 2026 AI Track",
        "description": "Finalize architecture diagram and problem statement.",
        "deadline": "2026-09-28T23:59:59.000Z",
        "status": "pending",
        "priority": "high",
        "sourceNoticeId": "notif-204-hackathon-hacksprint",
        "createdAt": "2026-09-03T11:00:00.000Z",
        "updatedAt": "2026-09-03T11:00:00.000Z"
      },
      {
        "id": "task-404-aarav-elective-select",
        "studentId": "stud-101-aarav-cse",
        "title": "Select Open Elective courses on ERP portal",
        "description": "Choose Applied Machine Learning as 1st preference.",
        "deadline": "2026-09-22T17:00:00.000Z",
        "status": "pending",
        "priority": "medium",
        "sourceNoticeId": "notif-205-academic-elective",
        "createdAt": "2026-09-02T10:00:00.000Z",
        "updatedAt": "2026-09-02T10:00:00.000Z"
      },
      {
        "id": "task-405-aarav-cloud-cert",
        "studentId": "stud-101-aarav-cse",
        "title": "Complete Google Cloud Skills Boost lab exercises",
        "description": "Finish Generative AI Fundamentals badge.",
        "deadline": "2026-09-30T23:59:59.000Z",
        "status": "completed",
        "priority": "low",
        "createdAt": "2026-08-20T14:00:00.000Z",
        "updatedAt": "2026-09-01T16:00:00.000Z"
      }
    ],
    "opportunities": [
      {
        "id": "opp-301-msft-sde",
        "noticeId": "notif-201-placement-msft",
        "title": "Microsoft India Campus SDE Role",
        "category": "placement",
        "description": "On-campus placement opportunity for 4th-year students with CGPA >= 8.0.",
        "deadline": "2026-09-20T23:59:59.000Z",
        "createdAt": "2026-09-10T08:35:00.000Z",
        "updatedAt": "2026-09-10T08:35:00.000Z"
      },
      {
        "id": "opp-303-hacksprint-hackathon",
        "noticeId": "notif-204-hackathon-hacksprint",
        "title": "HackSprint 2026 Hackathon Team Registration",
        "category": "event",
        "description": "36-hour national inter-college hackathon with INR 2.5 Lakh prize pool.",
        "deadline": "2026-09-28T23:59:59.000Z",
        "createdAt": "2026-09-02T15:35:00.000Z",
        "updatedAt": "2026-09-02T15:35:00.000Z"
      }
    ],
    "recentNotices": [
      {
        "id": "notif-201-placement-msft",
        "title": "Campus Recruitment Drive 2026 - Microsoft SDE & Support Engineering",
        "content": "The Training & Placement Cell (T&P) is pleased to announce...",
        "source": "Training & Placement Cell",
        "category": "placement",
        "createdAt": "2026-09-10T08:30:00.000Z",
        "updatedAt": "2026-09-10T08:30:00.000Z"
      },
      {
        "id": "notif-202-scholarship-nsp",
        "title": "National Merit-cum-Means Post-Matric Scholarship Scheme 2026-27",
        "content": "Applications are invited from undergraduate students...",
        "source": "Dean of Student Welfare Office",
        "category": "scholarship",
        "createdAt": "2026-09-08T10:00:00.000Z",
        "updatedAt": "2026-09-08T10:00:00.000Z"
      }
    ]
  }
}
```

- **Example Response (404 Not Found)**:
```json
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student with id unknown-student-id not found for dashboard"
  }
}
```
