import React from 'react';
import { Briefcase, GraduationCap, Calendar, Award, Users, FileText } from 'lucide-react';

const CATEGORY_CONFIG = {
  placement: {
    label: 'Placement',
    bg: 'bg-[#FDF3EF] text-[#C65A2E] border-[#E8A58B]',
    icon: Briefcase,
  },
  exam: {
    label: 'Exam & Dues',
    bg: 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]',
    icon: GraduationCap,
  },
  event: {
    label: 'Event & Hackathon',
    bg: 'bg-[#F0FDF4] text-[#166534] border-[#86EFAC]',
    icon: Calendar,
  },
  scholarship: {
    label: 'Scholarship',
    bg: 'bg-[#FEFCE8] text-[#854D0E] border-[#FDE047]',
    icon: Award,
  },
  club: {
    label: 'Club Activity',
    bg: 'bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]',
    icon: Users,
  },
  administrative: {
    label: 'Notice & Admin',
    bg: 'bg-[#F1F5F9] text-[#334155] border-[#CBD5E1]',
    icon: FileText,
  },
};

export default function CategoryTag({ category, className = '' }) {
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.administrative;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium border rounded-full ${config.bg} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
