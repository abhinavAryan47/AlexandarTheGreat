/**
 * API Wrapper Layer for AlexandarTheGreat
 * Configured to seamlessly interact with backend at http://localhost:5001
 * with automatic fallback to high-fidelity offline mock data if backend is offline.
 */

import { INITIAL_NOTICES, INITIAL_TASKS, INITIAL_STUDENT_PROFILE } from '../data/mockData';

const BASE_URL = 'http://localhost:5001';
const DEFAULT_STUDENT_ID = 'stud-101-aarav-cse';

// Local storage key defaults
const STORAGE_KEYS = {
  NOTICES: 'alexandar_notices_v2',
  TASKS: 'alexandar_tasks_v2',
  PROFILE: 'alexandar_profile_v2'
};

function getStored(key, defaultData) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultData;
  } catch (err) {
    return defaultData;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save failed', err);
  }
}

let currentNotices = getStored(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
let currentTasks = getStored(STORAGE_KEYS.TASKS, INITIAL_TASKS);
let currentProfile = getStored(STORAGE_KEYS.PROFILE, INITIAL_STUDENT_PROFILE);

/**
 * Normalizer: Converts backend Notice into frontend Notice shape
 */
function normalizeNotice(bNotice) {
  return {
    id: bNotice.id,
    title: bNotice.title,
    rawText: bNotice.content || bNotice.rawText || '',
    category: bNotice.category || 'administrative',
    deadline: bNotice.deadline || new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
    eligibility: bNotice.eligibility || (bNotice.source ? [bNotice.source] : ['All Students']),
    requiredAction: bNotice.requiredAction || bNotice.title,
    department: bNotice.source || bNotice.department || 'Campus Admin',
    urgency: bNotice.urgency || (bNotice.category === 'placement' || bNotice.category === 'exam' ? 'urgent' : 'soon'),
    relevanceScore: bNotice.relevanceScore || 0.85,
    createdAt: bNotice.createdAt || new Date().toISOString()
  };
}

/**
 * Normalizer: Converts backend Task into frontend Task shape
 */
function normalizeTask(bTask) {
  return {
    id: bTask.id,
    noticeId: bTask.sourceNoticeId || bTask.noticeId || 'not-001',
    title: bTask.title,
    dueDate: bTask.deadline || bTask.dueDate,
    status: bTask.status === 'completed' ? 'done' : (bTask.status || 'pending'),
    priority: bTask.priority || 'medium',
    category: bTask.category || 'administrative'
  };
}

/**
 * Normalizer: Converts backend Student into frontend StudentProfile shape
 */
function normalizeStudent(bStudent) {
  return {
    id: bStudent.id || DEFAULT_STUDENT_ID,
    name: bStudent.name || 'Aarav Sharma',
    rollNumber: bStudent.id || '2024CSE042',
    year: bStudent.year || 3,
    branch: bStudent.branch || 'Computer Science and Engineering',
    email: bStudent.email || 'aarav.sharma@campus.edu.in',
    cgpa: bStudent.cgpa || 8.85,
    interests: bStudent.academicInterests || bStudent.interests || ['Artificial Intelligence', 'Distributed Systems'],
    placementPrefs: bStudent.placementPreferences || bStudent.placementPrefs || ['Software Development Engineer', 'AI/ML Engineer']
  };
}

/**
 * GET /api/students/:id or GET /api/dashboard/:studentId
 */
export async function getProfile(studentId = DEFAULT_STUDENT_ID) {
  try {
    const res = await fetch(`${BASE_URL}/api/students/${studentId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        currentProfile = normalizeStudent(json.data);
        setStored(STORAGE_KEYS.PROFILE, currentProfile);
        return currentProfile;
      }
    }
  } catch (err) {
    console.info('Backend API unavailable, using offline student profile');
  }
  return currentProfile;
}

/**
 * PUT/PATCH /api/students/:id
 */
export async function updateProfile(updatedData, studentId = DEFAULT_STUDENT_ID) {
  try {
    const payload = {
      name: updatedData.name,
      year: updatedData.year,
      branch: updatedData.branch,
      academicInterests: updatedData.interests,
      placementPreferences: updatedData.placementPrefs
    };
    const res = await fetch(`${BASE_URL}/api/students/${studentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        currentProfile = normalizeStudent(json.data);
        setStored(STORAGE_KEYS.PROFILE, currentProfile);
        return currentProfile;
      }
    }
  } catch (err) {
    console.info('Backend PATCH student failed, fallback to local storage');
  }
  currentProfile = { ...currentProfile, ...updatedData };
  setStored(STORAGE_KEYS.PROFILE, currentProfile);
  return currentProfile;
}

/**
 * GET /api/notices
 */
export async function getNotices(filters = {}) {
  let notices = [...currentNotices];
  try {
    const res = await fetch(`${BASE_URL}/api/notices`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        notices = json.data.map(normalizeNotice);
        // Merge with local newly ingested notices if any
        const existingIds = new Set(notices.map(n => n.id));
        currentNotices.forEach(cn => {
          if (!existingIds.has(cn.id)) notices.unshift(cn);
        });
        currentNotices = notices;
        setStored(STORAGE_KEYS.NOTICES, currentNotices);
      }
    }
  } catch (err) {
    console.info('Backend GET notices unavailable, using local mock feed');
  }

  // Frontend client-side filtering
  if (filters.category && filters.category !== 'all') {
    notices = notices.filter(n => n.category === filters.category);
  }

  if (filters.urgency && filters.urgency !== 'all') {
    notices = notices.filter(n => n.urgency === filters.urgency);
  }

  if (filters.onlyRelevant) {
    notices = notices.filter(n => (n.relevanceScore || 0.8) >= 0.70);
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    notices = notices.filter(n =>
      n.title.toLowerCase().includes(q) ||
      (n.requiredAction && n.requiredAction.toLowerCase().includes(q)) ||
      (n.rawText && n.rawText.toLowerCase().includes(q))
    );
  }

  return notices;
}

/**
 * GET /api/tasks/student/:studentId or GET /api/tasks
 */
export async function getTasks(studentId = DEFAULT_STUDENT_ID) {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/student/${studentId}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        currentTasks = json.data.map(normalizeTask);
        setStored(STORAGE_KEYS.TASKS, currentTasks);
        return currentTasks;
      }
    }
  } catch (err) {
    console.info('Backend GET tasks unavailable, using local mock tasks');
  }
  return currentTasks;
}

/**
 * PATCH /api/tasks/:id
 */
export async function updateTaskStatus(taskId, newStatus) {
  const backendStatus = newStatus === 'done' ? 'completed' : newStatus;
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: backendStatus })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const updated = normalizeTask(json.data);
        currentTasks = currentTasks.map(t => t.id === taskId ? updated : t);
        setStored(STORAGE_KEYS.TASKS, currentTasks);
        return updated;
      }
    }
  } catch (err) {
    console.info('Backend PATCH task failed, fallback to local storage');
  }

  currentTasks = currentTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
  setStored(STORAGE_KEYS.TASKS, currentTasks);
  return currentTasks.find(t => t.id === taskId);
}

/**
 * POST /api/tasks/from-notice or POST /api/tasks
 */
export async function createNoticeTask(notice, studentId = DEFAULT_STUDENT_ID) {
  try {
    const res = await fetch(`${BASE_URL}/api/tasks/from-notice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noticeId: notice.id, studentId })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && Array.isArray(json.data.tasks) && json.data.tasks.length > 0) {
        const createdTasks = json.data.tasks.map(normalizeTask);
        currentTasks = [...createdTasks, ...currentTasks];
        setStored(STORAGE_KEYS.TASKS, currentTasks);
        return createdTasks[0];
      }
    }
  } catch (err) {
    console.info('Backend task generation failed, fallback to client creation');
  }

  const fallbackTask = {
    id: `task-${Date.now().toString().slice(-4)}`,
    noticeId: notice.id,
    title: notice.requiredAction || notice.title,
    dueDate: notice.deadline,
    status: 'pending',
    category: notice.category,
    priority: notice.urgency === 'urgent' ? 'high' : 'medium'
  };
  currentTasks = [fallbackTask, ...currentTasks];
  setStored(STORAGE_KEYS.TASKS, currentTasks);
  return fallbackTask;
}

/**
 * POST /api/calendar/create -> Sync task deadline with Google Calendar
 */
export async function syncGoogleCalendar(taskId) {
  try {
    const res = await fetch(`${BASE_URL}/api/calendar/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (err) {
    console.info('Backend calendar sync endpoint unavailable');
  }
  return {
    status: 'unconfigured',
    configured: false,
    message: 'Google Calendar API credentials are not configured in backend/.env. Task deadline remains actively tracked in your Smart Campus local planner.'
  };
}

/**
 * POST /api/agent/chat -> NVIDIA NIM Tool-Calling Campus Agent
 */
export async function askQuery(question, studentId = DEFAULT_STUDENT_ID) {
  try {
    const res = await fetch(`${BASE_URL}/api/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, message: question })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        // Extract matching notice IDs if tools were executed
        const matchingNoticeIds = [];
        if (Array.isArray(json.data.toolCallsExecuted)) {
          json.data.toolCallsExecuted.forEach(tc => {
            if (tc.result && Array.isArray(tc.result.items)) {
              tc.result.items.forEach(i => i.id && matchingNoticeIds.push(i.id));
            }
          });
        }

        return {
          question,
          answer: json.data.message,
          toolCallsExecuted: json.data.toolCallsExecuted || [],
          matchingNoticeIds: matchingNoticeIds.length > 0 ? matchingNoticeIds : currentNotices.slice(0, 3).map(n => n.id),
          timestamp: new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.info('Backend NIM Agent endpoint unavailable, fallback to mock AI');
  }

  // Fallback loading delay + local answer generator
  await new Promise(r => setTimeout(r, 600));

  const qLower = question.toLowerCase();
  let answer = "";
  let matchingNoticeIds = [];

  const notices = [...currentNotices];

  if (qLower.includes("week") || qLower.includes("due") || qLower.includes("today") || qLower.includes("deadline")) {
    const urgentOrSoon = notices.filter(n => n.urgency === "urgent" || n.urgency === "soon");
    matchingNoticeIds = urgentOrSoon.map(n => n.id);
    answer = `You have ${urgentOrSoon.length} high-priority deadlines coming up this week. Key items include the TCS NQT Registration and the End Semester Exam Fee payment.`;
  } else if (qLower.includes("placement") || qLower.includes("job") || qLower.includes("tcs") || qLower.includes("microsoft")) {
    const placements = notices.filter(n => n.category === "placement");
    matchingNoticeIds = placements.map(n => n.id);
    answer = `Found ${placements.length} placement & internship opportunities matching your profile! TCS NQT registration is active today, and Microsoft Campus recruitment drive is open.`;
  } else if (qLower.includes("scholarship") || qLower.includes("grant") || qLower.includes("fee")) {
    const scholarships = notices.filter(n => n.category === "scholarship");
    matchingNoticeIds = scholarships.map(n => n.id);
    answer = `There are ${scholarships.length} active scholarships. The Reliance Foundation Undergraduate Scholarship is accepting applications until October 6.`;
  } else {
    const matches = notices.filter(n =>
      n.title.toLowerCase().includes(qLower) ||
      (n.rawText && n.rawText.toLowerCase().includes(qLower)) ||
      (n.requiredAction && n.requiredAction.toLowerCase().includes(qLower))
    );
    matchingNoticeIds = matches.map(n => n.id);
    answer = matches.length > 0
      ? `Found ${matches.length} campus notice(s) matching your query "${question}". Here are the details:`
      : `I analyzed active campus circulars for "${question}". Try searching for "placements", "scholarships", or "due this week".`;
  }

  return {
    question,
    answer,
    toolCallsExecuted: [],
    matchingNoticeIds,
    timestamp: new Date().toISOString()
  };
}

/**
 * POST /api/notices/analyze -> NVIDIA NIM AI Notice Ingestion & Structured Extraction
 */
export async function ingestNotice(rawText, studentId = DEFAULT_STUDENT_ID) {
  try {
    const res = await fetch(`${BASE_URL}/api/notices/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: rawText, studentId })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.notice) {
        const newNotice = normalizeNotice(json.data.notice);
        if (json.data.evaluation) {
          newNotice.relevanceScore = json.data.evaluation.relevanceScore ? json.data.evaluation.relevanceScore / 100 : 0.90;
        }
        currentNotices = [newNotice, ...currentNotices];
        setStored(STORAGE_KEYS.NOTICES, currentNotices);
        return newNotice;
      }
    }
  } catch (err) {
    console.info('Backend NIM Notice Extraction unavailable, fallback to local ingest');
  }

  // Local fallback
  const newNotice = {
    id: `not-${Date.now().toString().slice(-4)}`,
    title: "Ingested Circular: " + rawText.slice(0, 45) + "...",
    rawText: rawText,
    category: "administrative",
    deadline: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    eligibility: ["All Students"],
    requiredAction: "Review circular content and record task deadline",
    department: "Campus Admin",
    urgency: "soon",
    relevanceScore: 0.85,
    createdAt: new Date().toISOString()
  };
  currentNotices = [newNotice, ...currentNotices];
  setStored(STORAGE_KEYS.NOTICES, currentNotices);
  return newNotice;
}
