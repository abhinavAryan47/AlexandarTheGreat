# AlexandarTheGreat 🏛️🤖 — Smart Campus AI Frontend

**AlexandarTheGreat** is an intelligent, agentic Smart Campus AI platform designed to transform how university students navigate academic notices, placement drives, competitive scholarships, examinations, and college activities.

---

## 🌟 Overview

The frontend replaces noisy, unstructured college noticeboards with a calm, triage-first digital noticeboard.

### Key Features

1. **Natural Language Query Bar (`<QueryBar />`)**: Ask questions like *"what is due this week?"* or *"which placements am I eligible for?"* with real-time keyword matching and interactive answer cards.
2. **Urgency-Grouped Feed (`DashboardView`)**: Notices sorted into **Today / Urgent**, **This Week**, and **Later**, with distinct urgency accent borders (`--signal` burnt-orange, amber, `--calm` teal).
3. **Relevance Engine & Profile (`ProfileView`)**: Student profile (year, branch, interests, placement preferences) dynamically computes relevance scores for all circulars.
4. **Actionable Task Queue (`TasksView`)**: One-click task generation from circulars with completion checkboxes, due date sorting, and progress metrics.
5. **Notice Expansion & Raw Circular Text**: Compact summary card expands to reveal eligibility tags, issuing authority, and raw circular accordion view.

---

## 🎨 Design System

- **Headlines**: `Fraunces` (Slab Serif / Display face)
- **Body UI**: `Inter` (Plain, legible sans-serif)
- **Color Palette**:
  - `--ink`: `#1B2430` (Near-black navy)
  - `--paper`: `#F7F5F0` (Warm off-white noticeboard canvas)
  - `--signal`: `#C65A2E` (Burnt-orange urgent accent)
  - `--calm`: `#3D5A57` (Muted teal-green)
  - `--line`: `#D8D3C7` (Hairline dividers & borders)
  - `--muted`: `#6B6459` (Secondary text)

---

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Icons)

---

## 🚀 Running Locally

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install dependencies (if not installed)
npm install

# 3. Start development server
npm run dev
```

Open `http://localhost:5173` to interact with the application.
