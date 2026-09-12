# Smart Campus AI — Frontend Build Spec

Use this document as the build prompt for an AI coding tool (Claude Code, v0, bolt, etc.) or as your own implementation checklist. It covers design direction, pages, components, and mock data so the frontend can be built and demoed **standalone**, before any backend exists.

---

## 1. Project Summary

**What it is:** A student-facing web app that turns messy college notices (circulars, placement mails, exam notifications, event flyers) into a clean, personalized feed of deadlines and action items — plus a natural-language query box to ask things like *"what's due this week?"* or *"which placements am I eligible for?"*

**Scope for this build:** Frontend only. No real backend yet — wire everything to mock/static JSON data structured exactly like the future API will return it, so swapping in a real API later is a drop-in change.

---

## 2. Design Direction

**Subject & audience:** First-year engineering students drowning in notices. The job of this UI is triage — reduce anxiety about missing something, not add more noise.

**Avoid the generic SaaS-dashboard look** (identical rounded cards, one shadow on everything, cream+terracotta palette, ALL-CAPS eyebrow labels). Instead:

**Concept — "The Noticeboard, Organized":** lean into the actual physical object this replaces — a campus noticeboard — but rebuilt as something legible and calm. Torn-paper chaos becomes ordered rows; pins become urgency indicators.

**Color tokens:**
- `--ink: #1B2430` (near-black navy — primary text/background)
- `--paper: #F7F5F0` (warm off-white, not stark white)
- `--signal: #C65A2E` (burnt-orange — used ONLY for urgent/overdue items, sparingly)
- `--calm: #3D5A57` (muted teal-green — used for "on track" / low urgency)
- `--line: #D8D3C7` (hairline dividers, borders)
- `--muted: #6B6459` (secondary text)

**Type:**
- Headlines/section titles: a slab serif or condensed display face (e.g. "Fraunces" or "Libre Caslon Text") — gives it a "noticeboard heading" feel, not corporate SaaS.
- Body/UI text: a plain, highly legible sans (e.g. "Inter" or "IBM Plex Sans").
- No all-caps labels. No tracked-out eyebrows. Use sentence case throughout.

**Layout concept:**
```
┌─────────────────────────────────────────────┐
│  Smart Campus AI          [profile icon]     │
│  ┌─────────────────────────────────────────┐ │
│  │ Ask anything — "what's due this week?"  │ │  ← NL query bar, always visible, top
│  └─────────────────────────────────────────┘ │
├───────────┬───────────────────────────────────┤
│ Filters   │  Today            (2 urgent)      │
│ - Category│  ┌───────────────────────────┐    │
│ - Urgency │  │ [urgent] TCS Placement     │    │
│ - Branch  │  │ Registration closes 6pm    │    │
│           │  └───────────────────────────┘    │
│           │  This week        (4 items)       │
│           │  ...                              │
│           │  Later                            │
│           │  ...                              │
└───────────┴───────────────────────────────────┘
```
- Left rail: filters (collapsible on mobile into a top sheet).
- Main column: notices grouped by time-urgency (Today / This Week / Later / Past), not by category by default — urgency is the primary sort, category is a filter.
- Left border accent color on each card (not the whole card tinted) indicates urgency — this is the one "structural device that encodes information," not decoration.
- Query bar is the hero — it's the single most distinctive, "wow" interaction. One subtle focus animation on it; no scattered hover effects elsewhere.

**Restraint rule:** Only the urgent-item accent color and the query bar get visual emphasis. Everything else stays quiet: hairline borders, no drop shadows, no gradients.

---

## 3. Tech Stack

- **React** (function components + hooks)
- **Tailwind CSS** for styling (use the tokens above as custom colors in config, not default Tailwind palette)
- **lucide-react** for icons
- No backend calls yet — all data from a local `mockData.js` file, structured to match the future API contract below.

---

## 4. Data Models (match these exactly — backend will conform to this later)

```ts
// Notice — as extracted from a raw circular
type Notice = {
  id: string;
  title: string;
  rawText: string;            // original notice text, shown on expand
  category: "placement" | "exam" | "event" | "scholarship" | "club" | "administrative";
  deadline: string | null;    // ISO date, null if no deadline
  eligibility: string[];      // e.g. ["3rd year", "CSE", "CGPA > 7"]
  requiredAction: string;     // e.g. "Register on portal before 6pm"
  department: string | null;
  urgency: "urgent" | "soon" | "later";  // derived from deadline proximity
  relevanceScore: number;     // 0-1, computed against student profile
};

// Task — generated from a relevant Notice
type Task = {
  id: string;
  noticeId: string;
  title: string;
  dueDate: string | null;
  status: "pending" | "done" | "dismissed";
  category: Notice["category"];
};

// StudentProfile — used for relevance filtering
type StudentProfile = {
  name: string;
  year: number;               // 1-4
  branch: string;              // e.g. "CSE"
  interests: string[];
  placementPrefs: string[];
};
```

Create `mockData.js` with **at least 10 sample notices** spanning all categories and urgency levels, 5 derived tasks, and 1 sample student profile. Make the sample content realistic (real-sounding company names for placements, real exam names, etc.) — this matters for the demo feeling credible.

---

## 5. Pages / Views

### 5.1 Dashboard (main view)
- NL query bar at top (see §6)
- Left filter rail: category checkboxes, urgency toggle, "show only relevant to me" toggle
- Main feed: notices grouped into **Today / This Week / Later**, each as a card showing title, category tag, deadline countdown, required action, left-border urgency color
- Clicking a card expands it to show full extracted fields (eligibility, department, raw original text in a collapsed "view original notice" toggle)

### 5.2 Tasks view
- Flat list of generated Tasks, filterable by status (pending/done/dismissed)
- Checkbox to mark done, swipe/button to dismiss
- Sorted by due date

### 5.3 Profile / Settings
- Simple form: year, branch, interests (tag input), placement preferences
- This is what relevance-matching will run against later — for now, just changing these values should re-filter the mock notices client-side (simple keyword/tag matching against `eligibility`/`department` fields is enough for the frontend demo)

### 5.4 Query results (inline, not a separate page)
- When a user types a query in the NL bar, show results inline below it as a filtered/answered view (mocked: simple keyword matching against the query string mapped to canned responses is fine for now — no real LLM call yet)

---

## 6. The Natural-Language Query Bar (hero feature)

- Persistent at the top of every page
- Placeholder text rotates through examples: *"What do I need to complete this week?"*, *"Which placement opportunities am I eligible for?"*, *"Any scholarship deadlines coming up?"*
- On submit: since there's no backend yet, do simple mock logic — keyword-match the query against notice categories/deadlines and render a short natural-language-style answer + a filtered list of matching notice cards below it
- Include a loading state (skeleton/pulse, ~600ms fake delay) so the interaction feels real for a demo

---

## 7. Component Checklist

- `<QueryBar />`
- `<FilterRail />`
- `<NoticeCard />` (compact + expanded states)
- `<TaskItem />`
- `<UrgencyBadge />`
- `<CategoryTag />`
- `<ProfileForm />`
- `<EmptyState />` — for when filters return nothing; write it in the interface's voice ("No notices match these filters — try widening your filters" not a generic "No data")
- `<TodayDigest />` — small summary strip: "2 urgent · 4 this week"

---

## 8. Responsive & Accessibility Requirements

- Fully usable down to mobile width (filter rail collapses to a bottom sheet or top drawer)
- Visible keyboard focus states on all interactive elements
- Respect `prefers-reduced-motion`
- Sufficient color contrast — test the signal/calm accent colors against the paper background

---

## 9. Future API Contract (for reference — don't build backend now)

```
POST /api/notices/ingest      → { rawText } → Notice
GET  /api/notices?filter=...  → Notice[]
GET  /api/tasks                → Task[]
PATCH /api/tasks/:id           → update status
GET  /api/profile              → StudentProfile
PUT  /api/profile              → update StudentProfile
POST /api/query                → { question } → { answer, matchingNoticeIds }
```

Structure the frontend's data-fetching layer (even though it's mocked) as if calling these — a thin `api.js` wrapper with functions like `getNotices()`, `getTasks()`, `askQuery(question)` that currently just return mock data, so swapping in real `fetch()` calls later touches one file.
