import React from 'react';
import { AlertCircle, Clock, CalendarCheck } from 'lucide-react';

const URGENCY_CONFIG = {
  urgent: {
    label: 'Urgent',
    bg: 'bg-[#C65A2E] text-white',
    icon: AlertCircle,
  },
  soon: {
    label: 'Due Soon',
    bg: 'bg-[#D97706] text-white',
    icon: Clock,
  },
  later: {
    label: 'On Track',
    bg: 'bg-[#3D5A57] text-white',
    icon: CalendarCheck,
  },
};

export default function UrgencyBadge({ urgency, className = '' }) {
  const config = URGENCY_CONFIG[urgency] || URGENCY_CONFIG.later;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded tracking-tight shadow-xs ${config.bg} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
