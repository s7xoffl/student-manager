import React from 'react';
import { Mail, Phone, Eye, Edit2, Trash2, MapPin } from 'lucide-react';
import { Student } from '../types';
import { getInitials, getAvatarColor, getStatusBadgeClass } from '../utils/studentHelpers';

interface StudentGridProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentGrid: React.FC<StudentGridProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-500 shadow-xs">
        <p className="text-base font-medium">No student records found</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div id="student-cards-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {students.map((student) => {
        const isSelected = selectedIds.includes(student.id);

        return (
          <div
            key={student.id}
            className={`bg-white rounded-xl border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
              isSelected ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {/* Top row */}
            <div className="p-4 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow-2xs ${getAvatarColor(
                      student.name
                    )}`}
                  >
                    {getInitials(student.name)}
                  </div>
                  <div>
                    <h4
                      onClick={() => onView(student)}
                      className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer text-sm leading-snug"
                    >
                      {student.name}
                    </h4>
                    <span className="font-mono text-xs font-medium text-slate-500">
                      {student.rollNo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(student.id)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Department & Year pill */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium truncate max-w-[200px]" title={student.department}>
                  {student.department}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {student.year}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium border ml-auto ${getStatusBadgeClass(
                    student.status
                  )}`}
                >
                  {student.status}
                </span>
              </div>

              {/* Contact and stats */}
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{student.phone}</span>
                </div>
                {student.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{student.city}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom row actions */}
            <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 rounded-b-xl flex items-center justify-between">
              <div className="text-xs text-slate-500 font-medium">
                GPA:{' '}
                <span className="font-mono font-bold text-blue-600 text-sm">
                  {student.gpa.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => onView(student)}
                  className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded-md transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(student)}
                  className="p-1 text-slate-500 hover:text-amber-600 hover:bg-white rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(student)}
                  className="p-1 text-slate-500 hover:text-rose-600 hover:bg-white rounded-md transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
