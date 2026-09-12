import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DashboardView from './pages/DashboardView';
import TasksView from './pages/TasksView';
import ProfileView from './pages/ProfileView';
import { getNotices, getTasks, updateTaskStatus, getProfile, updateProfile, askQuery, createNoticeTask } from './api/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notices, setNotices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studentProfile, setStudentProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: 'all',
    urgency: 'all',
    onlyRelevant: false,
    searchQuery: '',
  });

  // Load initial data from backend (with offline fallback)
  const loadData = useCallback(async (currentFilters = filters) => {
    try {
      const [profileData, noticeData, taskData] = await Promise.all([
        getProfile(),
        getNotices(currentFilters),
        getTasks()
      ]);

      setStudentProfile(profileData);
      setNotices(noticeData);
      setTasks(taskData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]);

  // Filter handlers
  const handleFilterChange = (newFilterPartial) => {
    setFilters((prev) => ({ ...prev, ...newFilterPartial }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      urgency: 'all',
      onlyRelevant: false,
      searchQuery: '',
    });
  };

  // Natural Language AI Campus Agent Query Handler
  const handleExecuteQuery = async (question) => {
    const response = await askQuery(question, studentProfile.id);
    return response;
  };

  // Create Task from Notice Action (Backend API POST /api/tasks/from-notice)
  const handleCreateTask = async (notice) => {
    const newTask = await createNoticeTask(notice, studentProfile.id);
    setTasks((prev) => [newTask, ...prev.filter(t => t.id !== newTask.id)]);
  };

  // Task Status Toggle & Dismiss
  const handleTaskStatusChange = async (taskId, newStatus) => {
    await updateTaskStatus(taskId, newStatus);
    setTasks((prev) => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  // Profile Save & Relevance Recalculation
  const handleSaveProfile = async (updatedData) => {
    const newProfile = await updateProfile(updatedData, studentProfile.id);
    setStudentProfile(newProfile);
    const freshNotices = await getNotices(filters);
    setNotices(freshNotices);
  };

  // Handle Newly Ingested Circular via AI Analysis
  const handleNoticeIngested = async (newNotice) => {
    setNotices((prev) => [newNotice, ...prev]);
    const freshTasks = await getTasks(studentProfile.id);
    setTasks(freshTasks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center font-sans text-sm text-[#1B2430]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#1B2430] border-t-transparent animate-spin" />
          <span>Loading AlexandarTheGreat Smart Campus AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1B2430] font-sans antialiased flex flex-col">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        studentProfile={studentProfile}
        taskCount={tasks.filter(t => t.status === 'pending').length}
        onToggleMobileFilter={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        onNoticeIngested={handleNoticeIngested}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            notices={notices}
            tasks={tasks}
            studentProfile={studentProfile}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onExecuteQuery={handleExecuteQuery}
            onCreateTask={handleCreateTask}
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksView
            tasks={tasks}
            onStatusChange={handleTaskStatusChange}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={studentProfile}
            onSaveProfile={handleSaveProfile}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#D8D3C7] bg-[#FFFFFF] py-4 mt-12 text-center text-xs text-[#6B6459]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-display font-semibold text-[#1B2430]">
            AlexandarTheGreat 🏛️ — Smart Campus AI
          </span>
          <span>
            Connected to Node.js + NVIDIA NIM Express API (http://localhost:5001)
          </span>
        </div>
      </footer>
    </div>
  );
}
