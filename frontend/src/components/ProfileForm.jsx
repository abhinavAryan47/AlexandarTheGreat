import React, { useState } from 'react';
import { Save, Plus, X, UserCheck, Sparkles, AlertCircle } from 'lucide-react';

const BRANCH_OPTIONS = [
  'CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotech'
];

export default function ProfileForm({ profile, onSave }) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    rollNumber: profile.rollNumber || '',
    year: profile.year || 1,
    branch: profile.branch || 'CSE',
    email: profile.email || '',
    interests: profile.interests || [],
    placementPrefs: profile.placementPrefs || [],
  });

  const [newInterest, setNewInterest] = useState('');
  const [newPref, setNewPref] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInterestAdd = (e) => {
    e.preventDefault();
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleInterestRemove = (item) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== item)
    });
  };

  const handlePrefAdd = (e) => {
    e.preventDefault();
    if (newPref.trim() && !formData.placementPrefs.includes(newPref.trim())) {
      setFormData({
        ...formData,
        placementPrefs: [...formData.placementPrefs, newPref.trim()]
      });
      setNewPref('');
    }
  };

  const handlePrefRemove = (item) => {
    setFormData({
      ...formData,
      placementPrefs: formData.placementPrefs.filter(p => p !== item)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#D8D3C7] rounded-lg p-6 shadow-xs max-w-2xl mx-auto">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#D8D3C7]">
        <div className="w-12 h-12 rounded-full bg-[#1B2430] text-white flex items-center justify-center font-display font-bold text-xl">
          {formData.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-[#1B2430]">Student Profile & Preferences</h2>
          <p className="text-xs text-[#6B6459]">
            Relevance engine uses these details to score and filter campus circulars automatically.
          </p>
        </div>
      </div>

      {isSaved && (
        <div className="mb-6 p-3 bg-[#F0F5F4] border border-[#3D5A57] text-[#3D5A57] rounded-md text-xs font-semibold flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <span>Profile saved successfully! Noticeboard relevance scores have been updated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Name & Roll Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="studentName" className="block font-semibold text-[#1B2430] mb-1">
              Full Name
            </label>
            <input
              id="studentName"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 text-xs text-[#1B2430]"
            />
          </div>

          <div>
            <label htmlFor="rollNumber" className="block font-semibold text-[#1B2430] mb-1">
              Roll / Registration Number
            </label>
            <input
              id="rollNumber"
              type="text"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 text-xs text-[#1B2430]"
            />
          </div>
        </div>

        {/* Year & Branch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="academicYear" className="block font-semibold text-[#1B2430] mb-1">
              Academic Year
            </label>
            <select
              id="academicYear"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              className="w-full bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 text-xs text-[#1B2430]"
            >
              <option value={1}>1st Year (B.Tech)</option>
              <option value={2}>2nd Year (B.Tech)</option>
              <option value={3}>3rd Year (B.Tech)</option>
              <option value={4}>4th Year (B.Tech)</option>
            </select>
          </div>

          <div>
            <label htmlFor="branchSelect" className="block font-semibold text-[#1B2430] mb-1">
              Engineering Branch
            </label>
            <select
              id="branchSelect"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 text-xs text-[#1B2430]"
            >
              {BRANCH_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Technical & Academic Interests */}
        <div>
          <label className="block font-semibold text-[#1B2430] mb-1">
            Academic & Tech Interests (Tags)
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Add interest (e.g., Artificial Intelligence, Robotics)..."
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              className="flex-1 bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 text-xs text-[#1B2430]"
            />
            <button
              onClick={handleInterestAdd}
              type="button"
              className="px-3 py-2 bg-[#1B2430] text-white rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.interests.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0F5F4] text-[#3D5A57] border border-[#3D5A57]/30 rounded-full text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleInterestRemove(tag)}
                  className="hover:text-red-600 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Placement & Career Preferences */}
        <div>
          <label className="block font-semibold text-[#1B2430] mb-1">
            Career & Internship Preferences
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Add preference (e.g., Software Engineering, Product)..."
              value={newPref}
              onChange={(e) => setNewPref(e.target.value)}
              className="flex-1 bg-[#F7F5F0] border border-[#D8D3C7] rounded-md px-3 py-2 text-xs text-[#1B2430]"
            />
            <button
              onClick={handlePrefAdd}
              type="button"
              className="px-3 py-2 bg-[#1B2430] text-white rounded-md text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.placementPrefs.map((pref) => (
              <span
                key={pref}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FDF3EF] text-[#C65A2E] border border-[#E8A58B] rounded-full text-xs font-medium"
              >
                {pref}
                <button
                  type="button"
                  onClick={() => handlePrefRemove(pref)}
                  className="hover:text-red-600 cursor-pointer ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-[#D8D3C7] flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-[#1B2430] text-[#F7F5F0] rounded-md text-xs font-semibold hover:bg-[#2C3848] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Profile...' : 'Save & Recalculate Feed'}
          </button>
        </div>
      </form>
    </div>
  );
}
