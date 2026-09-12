# AlexandarTheGreat 🏛️🤖

**AlexandarTheGreat** is an intelligent, agentic Smart Campus AI platform designed to transform how university students navigate academic notices, placement drives, competitive scholarships, examinations, and college activities.

---

## 📌 Project Status: Phase 1 (Foundation)

The project is currently in **Phase 1: Foundation & Persistence Architecture**.

### What Phase 1 Provides:
- Robust **Node.js + TypeScript + Express** REST API.
- Strict **Zod schema validation** across all endpoints.
- High-performance, concurrency-safe **asynchronous JSON file persistence** (`backend/data/`).
- Complete data models and CRUD operations for **Students**, **Notices**, **Opportunities**, and **Tasks**.
- Aggregated **Student Dashboard API** (`GET /api/dashboard/:studentId`).
- Comprehensive synthetic **Indian campus dataset** for seed testing.
- Full **API Specification** ([backend/API_SPEC.md](backend/API_SPEC.md)) for independent frontend development.
- Architectural blueprint ([backend/ARCHITECTURE.md](backend/ARCHITECTURE.md)) with hooks for future phases.
- Automated integration test suite powered by **Vitest + Supertest**.

---

## 🗺️ Project Roadmap

- [x] **Phase 1: Foundation & Persistence Layer** (Current)
  - Layered REST API, Zod schemas, JSON storage, CRUD endpoints, Dashboard aggregation, documentation, and test suite.
- [ ] **Phase 2: AI Notice Ingestion & Extraction Engine**
  - LLM integration to analyze raw circulars and extract dates, eligibility criteria, action items, and target branches.
- [ ] **Phase 3: Student Eligibility & Personalized Relevance Engine**
  - Smart scoring algorithms matching student profiles (CGPA, year, branch, interests) to opportunities.
- [ ] **Phase 4: Actionable Task Automation & Google Calendar Sync**
  - Auto-generating tasks with deadline reminders and calendar event integration.
- [ ] **Phase 5: Natural Language Campus AI Assistant**
  - Autonomous LLM agent equipped with Model Context Protocol (MCP) tools for real-time conversational assistance.
- [ ] **Phase 6: Frontend & Notification Dispatch**
  - Next.js web application and multi-channel notification services.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Backend Setup
```bash
# 1. Enter the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Populate demo seed data
npm run seed

# 4. Start the development server
npm run dev
```

The API will be live at `http://localhost:5000`.

### Run Automated Tests
```bash
cd backend
npm test
```

---

## 📚 Key Documentation

- 📖 **[Backend Setup & Guide](backend/README.md)**: Prerequisites, environment variables, commands, and examples.
- 📋 **[Frontend API Contract (API_SPEC.md)](backend/API_SPEC.md)**: Full REST API specification for all endpoints and request/response payloads.
- 🏗️ **[Architecture Guide (ARCHITECTURE.md)](backend/ARCHITECTURE.md)**: Architectural pattern breakdown and future component integration blueprints.