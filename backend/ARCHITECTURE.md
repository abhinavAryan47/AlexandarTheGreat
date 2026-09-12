# AlexandarTheGreat Backend — Architecture Overview

This document describes the architectural design of the **AlexandarTheGreat** backend (Phase 1 Foundation) and outlines how future AI, agentic, and integration capabilities will connect to this foundation.

---

## 1. Architectural Philosophy

The backend is built around three core architectural tenets:
1. **Strict Layered Separation**: High cohesion within layers and loose coupling across layers. Business rules are decoupled from transport (HTTP) and storage (Filesystem).
2. **Deterministic Type Safety & Validation**: All domain entities are strictly typed in TypeScript and validated at HTTP entry boundaries with Zod schemas.
3. **Storage-Agnostic Design**: Data persistence is isolated behind generic repository interfaces (`JsonRepository<T>`), allowing future migration to MongoDB, PostgreSQL, or Cloud Firestore without changing business services or HTTP controllers.

---

## 2. The 5-Layer Pattern

Every incoming request flows through 5 distinct layers:

```
[ HTTP Client / Next.js Frontend ]
               │
               ▼
┌──────────────────────────────────────┐
│ 1. Route Layer (src/routes/)         │  - URL routing & HTTP verb definitions
│                                      │  - Zod validation middleware bindings
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│ 2. Controller Layer (src/controllers)│  - HTTP parsing (req.params, req.body)
│                                      │  - Standardized responses via ApiResponse
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│ 3. Service Layer (src/services/)     │  - Core business logic & aggregations
│                                      │  - Cross-entity composition
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│ 4. Repository Layer (src/repositories│  - Typed CRUD contracts
│                                      │  - Query/filter abstraction
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│ 5. Storage Layer (src/repositories/  │  - Async File I/O (fs/promises)
│    json.repository.ts -> data/*.json)│  - Atomic write serialization / queue
└──────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | What it does NOT do |
| :--- | :--- | :--- |
| **Routes** | Define URL mapping, attach Zod validation middlewares, direct to controllers. | No business logic, no data manipulation. |
| **Controllers** | Extract request parameters, invoke service methods, format HTTP responses. | No direct database or file access, no raw domain logic. |
| **Services** | Implement application use cases, validate domain rules, coordinate multiple repositories. | No Express `req`/`res` references, no direct filesystem operations. |
| **Repositories** | Provide typed data access interface for domain models (`Student`, `Notice`, etc.). | No HTTP or validation logic. |
| **Storage (`JsonRepository<T>`)** | Safe serialization, concurrency write queues, file system reads/writes. | No entity-specific business logic. |

---

## 3. Persistence & Concurrency Safety

For the hackathon Phase 1, data is stored in local JSON files (`data/students.json`, `data/notices.json`, `data/opportunities.json`, `data/tasks.json`).

### Key Reliability Features:
1. **Directory & File Bootstrapping**: Automatic directory and empty file (`[]`) initialization on startup if files do not exist.
2. **Serialized Async Writes**: Each `JsonRepository` instance maintains an internal Promise write queue (`this.writeQueue`) to serialize file mutations and eliminate race conditions from concurrent requests.
3. **Atomic File Replacement**: Files are written to temporary files (`*.tmp.<timestamp>`) and renamed atomically, preventing partial/corrupt file writes if a process is interrupted.
4. **Environment Portability**: File paths resolve dynamically using `ENV.DATA_DIR` rather than hardcoded paths.

---

## 4. Future Extensibility Roadmap

The system is deliberately designed to plug into Phase 2–5 enhancements without refactoring the foundational layers:

```
src/
├── ai/                                  <-- [Phase 2: LLM Information Extraction]
│   ├── llm.service.ts                   - Gemini / OpenAI LLM integration
│   ├── notice-analyzer.service.ts       - Extracts deadlines, eligibility, actions
│   └── prompts/                         - Domain-specific prompt templates
│
├── services/
│   ├── student.service.ts
│   ├── notice.service.ts
│   ├── opportunity.service.ts
│   ├── task.service.ts
│   ├── dashboard.service.ts
│   ├── eligibility.service.ts           <-- [Phase 3: Eligibility Rules Engine]
│   ├── relevance.service.ts             <-- [Phase 3: Relevance & Interest Matcher]
│   ├── priority.service.ts              <-- [Phase 3: Dynamic Task Priority Engine]
│   ├── calendar.service.ts              <-- [Phase 4: Google Calendar Sync]
│   └── notification.service.ts          <-- [Phase 4: Multi-channel Notifications]
│
├── agents/                              <-- [Phase 5: Smart Campus AI Assistant]
│   ├── campus.agent.ts                  - Autonomous LangChain / AGY Agent
│   └── tools/                           - Model Context Protocol (MCP) Tools
│       ├── student.tools.ts
│       ├── notice.tools.ts
│       ├── task.tools.ts
│       └── opportunity.tools.ts
```

### Future Integration Points:
- **Notice Ingestion Pipeline (Phase 2)**: `NoticeService.createNotice()` will dispatch raw notice content to `NoticeAnalyzerService` to automatically extract deadlines and create structured `Opportunity` and `Task` entities.
- **Personalized Dashboard (Phase 3)**: `DashboardService.getStudentDashboard()` will invoke `EligibilityService` and `RelevanceService` to score and filter opportunities dynamically for the querying student.
- **Calendar & Notifications (Phase 4)**: `TaskService.createTask()` will trigger calendar sync when deadlines exist.
- **Agent Layer (Phase 5)**: The MCP tools under `src/agents/tools/` will wrap existing typed Service methods, allowing LLM agents to converse with students and query campus knowledge naturally.
