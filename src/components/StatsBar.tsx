import React from 'react';
import { Users, UserCheck, GraduationCap, Building2 } from 'lucide-react';
import { Student } from '../types';

interface StatsBarProps {
  students: Student[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ students }) => {
  const total = students.length;
  const active = students.filter((s) => s.status === 'Active').length;
  const avgGpa =
    total > 0
      ? (students.reduce((acc, curr) => acc + (Number(curr.gpa) || 0), 0) / total).toFixed(2)
      : '0.00';

  const departmentsCount = new Set(students.map((s) => s.department)).size;

  return (
    <div id="stats-overview" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div
        id="stat-card-total"
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-4"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Students</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{total}</h3>
        </div>
      </div>

      <div
        id="stat-card-active"
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-4"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Status</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{active}</h3>
        </div>
      </div>

      <div
        id="stat-card-gpa"
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-4"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average GPA</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{avgGpa}</h3>
        </div>
      </div>

      <div
        id="stat-card-depts"
        className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center space-x-4"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Departments</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{departmentsCount}</h3>
        </div>
      </div>
    </div>
  );
};
