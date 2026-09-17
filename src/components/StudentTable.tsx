import React from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
} from 'lucide-react';
import { Student, SortField, SortOrder } from '../types';
import { getInitials, getAvatarColor, getStatusBadgeClass } from '../utils/studentHelpers';

interface StudentTableProps {
  students: Student[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const isAllSelected = students.length > 0 && selectedIds.length === students.length;
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const renderSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 select-none">
            <th className="py-3.5 px-4 w-12 text-center">
              <input
                id="select-all-students-checkbox"
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isSomeSelected;
                }}
                onChange={onToggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
              onClick={() => onSort('rollNo')}
            >
              <div className="flex items-center space-x-1">
                <span>Roll No</span>
                {renderSortIcon('rollNo')}
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Student Details</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
              onClick={() => onSort('department')}
            >
              <div className="flex items-center space-x-1">
                <span>Department</span>
                {renderSortIcon('department')}
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
              onClick={() => onSort('year')}
            >
              <div className="flex items-center space-x-1">
                <span>Year & Sem</span>
                {renderSortIcon('year')}
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors text-right"
              onClick={() => onSort('gpa')}
            >
              <div className="flex items-center justify-end space-x-1">
                <span>GPA</span>
                {renderSortIcon('gpa')}
              </div>
            </th>
            <th
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center space-x-1">
                <span>Status</span>
                {renderSortIcon('status')}
              </div>
            </th>
            <th className="py-3.5 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {students.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-slate-500">
                <p className="text-base font-medium">No student records found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms</p>
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const isSelected = selectedIds.includes(student.id);
              return (
                <tr
                  key={student.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    isSelected ? 'bg-blue-50/60' : 'bg-white'
                  }`}
                >
                  <td className="py-3.5 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(student.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700 text-xs sm:text-sm">
                    {student.rollNo}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs ${getAvatarColor(
                          student.name
                        )}`}
                      >
                        {getInitials(student.name)}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onView(student)}
                          className="font-medium text-slate-900 hover:text-blue-600 hover:underline text-left block truncate"
                        >
                          {student.name}
                        </button>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 truncate max-w-[160px]" title={student.email}>
                            <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                            {student.email}
                          </span>
                          <span className="hidden md:flex items-center gap-1">
                            <Phone className="w-3 h-3 shrink-0 text-slate-400" />
                            {student.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/60 max-w-[180px] truncate" title={student.department}>
                      {student.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    <span className="font-medium">{student.year}</span>
                    <span className="text-slate-400 ml-1">· Sem {student.semester}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded ${
                        student.gpa >= 8.5
                          ? 'text-emerald-700 bg-emerald-50'
                          : student.gpa >= 7.0
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-amber-700 bg-amber-50'
                      }`}
                    >
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <button
                        id={`view-student-${student.id}`}
                        type="button"
                        onClick={() => onView(student)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        id={`edit-student-${student.id}`}
                        type="button"
                        onClick={() => onEdit(student)}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        id={`delete-student-${student.id}`}
                        type="button"
                        onClick={() => onDelete(student)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
