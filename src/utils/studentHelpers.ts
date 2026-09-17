import { StudentStatus } from '../types';

export function getInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-sky-100 text-sky-700 border-sky-200',
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getStatusBadgeClass(status: StudentStatus): string {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
    case 'Inactive':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
    case 'Graduated':
      return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
    case 'Suspended':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
