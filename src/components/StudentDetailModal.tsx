import React from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  BookOpen,
  Edit2,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { Student } from '../types';
import { getInitials, getAvatarColor, getStatusBadgeClass } from '../utils/studentHelpers';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !student) return null;

  const copyDetails = () => {
    const text = `Student: ${student.name} (${student.rollNo})\nDepartment: ${student.department} (${student.year})\nGPA: ${student.gpa}\nEmail: ${student.email}\nPhone: ${student.phone}\nStatus: ${student.status}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="student-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="student-detail-dialog"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
      >
        {/* Header background banner */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 h-28 px-6 pt-4 flex justify-end">
          <button
            id="close-detail-modal-btn"
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors h-fit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <div
                className={`w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-xl font-bold font-mono shrink-0 ${getAvatarColor(
                  student.name
                )}`}
              >
                {getInitials(student.name)}
              </div>
              <div className="pb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-600 font-mono">
                  Roll No: {student.rollNo}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                id="copy-student-info-btn"
                type="button"
                onClick={copyDetails}
                className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs flex items-center gap-1 transition-colors"
                title="Copy student summary"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                id="edit-from-detail-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(student);
                }}
                className="p-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                id="delete-from-detail-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(student);
                }}
                className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>

          {/* Academic Highlights */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 mb-5 text-center">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Department</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1" title={student.department}>
                {student.department}
              </span>
            </div>
            <div className="border-x border-slate-200/60 px-2">
              <span className="text-xs text-slate-500 font-medium block">Year & Sem</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {student.year} (Sem {student.semester})
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Cumulative GPA</span>
              <span className="text-sm font-bold text-blue-700 font-mono">
                {student.gpa.toFixed(2)} / 10.0
              </span>
            </div>
          </div>

          {/* Information Grid */}
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-24 shrink-0 text-xs font-medium">Email:</span>
              <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline font-mono text-xs sm:text-sm truncate">
                {student.email}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-24 shrink-0 text-xs font-medium">Phone:</span>
              <a href={`tel:${student.phone}`} className="text-slate-800 hover:text-blue-600 font-mono text-xs sm:text-sm">
                {student.phone}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-24 shrink-0 text-xs font-medium">Location:</span>
              <span className="text-slate-800">{student.city || 'Not specified'}</span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-24 shrink-0 text-xs font-medium">Enrolled On:</span>
              <span className="text-slate-800 font-mono text-xs">
                {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Award className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-500 w-24 shrink-0 text-xs font-medium">Gender:</span>
              <span className="text-slate-800">{student.gender}</span>
            </div>

            {student.notes && (
              <div className="pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-500 text-xs font-medium block">Notes & Achievements:</span>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {student.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              id="close-profile-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
