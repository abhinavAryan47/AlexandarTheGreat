# AlexandarTheGreat Backend (Phase 1)

The backend foundation for **AlexandarTheGreat**, a Smart Campus AI platform. Phase 1 provides the core REST API, type-safe validation, asynchronous JSON persistence, and data aggregation for students, notices, opportunities, tasks, and the student dashboard.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript (Strict Mode)
- **Framework**: Express.js
- **Validation**: Zod
- **Persistence**: Local Async JSON Storage with Write Queuing
- **Testing**: Vitest + Supertest
- **Development Tooling**: `tsx` (TypeScript Execution)

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher)
- [npm](https://www.npmjs.com/) (version 9.x or higher)

---

## 🚀 Quick Start Guide

### 1. Navigate to the backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` settings:
```env
PORT=5001
NODE_ENV=development
DATA_DIR=./data
CORS_ORIGIN=*
```

### 4. Seed Synthetic Campus Data
Populate the local JSON storage with realistic Indian campus test data (3 students, 5 notices, 5 opportunities, 8 tasks):
```bash
npm run seed
```

### 5. Start the Development Server
```bash
npm run dev
```
The server will start at **`http://localhost:5001`**.

---

## 🧪 Testing and Production Build

### Run Automated Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

### Run Production Server
```bash
npm start
```

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── env.ts                      # Environment configuration loader
│   ├── controllers/
│   │   ├── student.controller.ts       # Student HTTP handler
│   │   ├── notice.controller.ts        # Notice HTTP handler
│   │   ├── opportunity.controller.ts   # Opportunity HTTP handler
│   │   ├── task.controller.ts          # Task HTTP handler
│   │   └── dashboard.controller.ts     # Aggregated Dashboard handler
│   ├── models/
│   │   ├── student.model.ts            # Student TypeScript interface
│   │   ├── notice.model.ts             # Notice TypeScript interface
│   │   ├── opportunity.model.ts        # Opportunity TypeScript interface
│   │   ├── task.model.ts               # Task TypeScript interface
│   │   └── dashboard.model.ts          # Consolidated Dashboard interface
│   ├── schemas/
│   │   ├── student.schema.ts           # Student Zod input validation schemas
│   │   ├── notice.schema.ts            # Notice Zod schemas
│   │   ├── opportunity.schema.ts       # Opportunity Zod schemas
│   │   └── task.schema.ts              # Task Zod schemas
│   ├── repositories/
│   │   ├── json.repository.ts          # Generic async JSON repository with write queues
│   │   ├── student.repository.ts
│   │   ├── notice.repository.ts
│   │   ├── opportunity.repository.ts
│   │   └── task.repository.ts
│   ├── services/
│   │   ├── student.service.ts          # Student domain operations
│   │   ├── notice.service.ts           # Notice domain operations
│   │   ├── opportunity.service.ts      # Opportunity domain operations
│   │   ├── task.service.ts             # Task domain operations
│   │   └── dashboard.service.ts        # Aggregation engine for dashboard
│   ├── routes/
│   │   ├── student.routes.ts
│   │   ├── notice.routes.ts
│   │   ├── opportunity.routes.ts
│   │   ├── task.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts                    # Root API router
│   ├── middleware/
│   │   ├── validate.middleware.ts      # Generic Zod validation middleware
│   │   ├── error.middleware.ts         # Centralized global error handler
│   │   └── not-found.middleware.ts     # 404 handler
│   ├── utils/
│   │   └── api-response.ts             # Standardized response formatters
│   ├── scripts/
│   │   └── seed.ts                     # Database seeding script
│   ├── app.ts                          # Express application factory
│   └── server.ts                       # Server bootstrap listener
├── data/                               # Local JSON data files (created on demand)
│   ├── students.json
│   ├── notices.json
│   ├── opportunities.json
│   └── tasks.json
├── tests/
│   └── api.test.ts                     # Integration test suite
├── API_SPEC.md                         # Complete API documentation for frontend
├── ARCHITECTURE.md                     # Deep-dive architecture and roadmap
├── package.json
└── tsconfig.json
```

---

## 📡 REST API Summary

Full schemas and examples are documented in [API_SPEC.md](API_SPEC.md).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health status check |
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/:id` | Get student by ID |
| `POST` | `/api/students` | Create a student |
| `PATCH` | `/api/students/:id` | Update student profile |
| `DELETE` | `/api/students/:id` | Delete student |
| `GET` | `/api/notices` | List all notices |
| `GET` | `/api/notices/:id` | Get notice by ID |
| `POST` | `/api/notices` | Create raw notice |
| `PATCH` | `/api/notices/:id` | Update notice |
| `DELETE` | `/api/notices/:id` | Delete notice |
| `GET` | `/api/opportunities` | List all opportunities |
| `GET` | `/api/opportunities/:id` | Get opportunity by ID |
| `POST` | `/api/opportunities` | Create opportunity |
| `PATCH` | `/api/opportunities/:id` | Update opportunity |
| `DELETE` | `/api/opportunities/:id` | Delete opportunity |
| `GET` | `/api/tasks` | List all tasks |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `GET` | `/api/tasks/student/:studentId` | List tasks for a specific student |
| `POST` | `/api/tasks` | Create task for a student |
| `PATCH` | `/api/tasks/:id` | Update task status or details |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/dashboard/:studentId` | Consolidated student campus dashboard |

---

## 💡 Example cURL Requests

### 1. Health Check
```bash
curl -X GET http://localhost:5001/health
```

### 2. Get Student Dashboard
```bash
curl -X GET http://localhost:5001/api/dashboard/stud-101-aarav-cse
```

### 3. Create a Task for a Student
```bash
curl -X POST http://localhost:5001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "stud-101-aarav-cse",
    "title": "Submit AI Term Paper draft",
    "deadline": "2026-09-28T18:00:00.000Z",
    "status": "pending",
    "priority": "high"
  }'
```

### 4. Update Task Status
```bash
curl -X PATCH http://localhost:5001/api/tasks/<TASK_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```
