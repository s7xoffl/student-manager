/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Download,
  RotateCcw,
  LayoutGrid,
  List,
  Filter,
  CheckSquare,
  Trash2,
  GraduationCap,
  FileSpreadsheet,
} from 'lucide-react';
import { Student, SortField, SortOrder, Department, YearOfStudy, StudentStatus } from './types';
import { DEPARTMENTS } from './data/initialStudents';
import { loadStudents, saveStudents, resetToDefaultStudents, exportStudentsToCSV, exportStudentsToJSON } from './utils/storage';
import { StatsBar } from './components/StatsBar';
import { StudentTable } from './components/StudentTable';
import { StudentGrid } from './components/StudentGrid';
import { StudentModal } from './components/StudentModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Sorting
  const [sortBy, setSortBy] = useState<SortField>('rollNo');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // View mode
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Multi-selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isBulkDeleteConfirmOpen, setIsBulkDeleteConfirmOpen] = useState(false);

  // Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    const data = loadStudents();
    setStudents(data);
    setIsLoaded(true);
  }, []);

  // Persist on change
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    saveStudents(newStudents);
  };

  // Add / Edit Student handler
  const handleSaveStudent = (studentData: Student) => {
    if (editingStudent) {
      // Update
      const updated = students.map((s) => (s.id === studentData.id ? studentData : s));
      updateStudents(updated);
      addToast(`Updated record for ${studentData.name} (${studentData.rollNo})`, 'success');
      setEditingStudent(null);
    } else {
      // Create
      const updated = [studentData, ...students];
      updateStudents(updated);
      addToast(`Added new student ${studentData.name} (${studentData.rollNo})`, 'success');
    }
  };

  // Single delete
  const handleConfirmSingleDelete = () => {
    if (!deletingStudent) return;
    const studentName = deletingStudent.name;
    const updated = students.filter((s) => s.id !== deletingStudent.id);
    updateStudents(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== deletingStudent.id));
    addToast(`Deleted record for ${studentName}`, 'info');
    setDeletingStudent(null);
  };

  // Bulk delete
  const handleConfirmBulkDelete = () => {
    const count = selectedIds.length;
    const updated = students.filter((s) => !selectedIds.includes(s.id));
    updateStudents(updated);
    setSelectedIds([]);
    addToast(`Successfully deleted ${count} student records`, 'info');
  };

  // Bulk status update
  const handleBulkStatusChange = (status: StudentStatus) => {
    const updated = students.map((s) =>
      selectedIds.includes(s.id) ? { ...s, status } : s
    );
    updateStudents(updated);
    addToast(`Updated status to ${status} for ${selectedIds.length} students`, 'success');
    setSelectedIds([]);
  };

  // Reset to default sample records
  const handleResetData = () => {
    if (window.confirm('Reset all student data back to default records? Custom changes will be reset.')) {
      const resetList = resetToDefaultStudents();
      setStudents(resetList);
      setSelectedIds([]);
      addToast('Reset student records to initial sample data', 'info');
    }
  };

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered & Sorted Students
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchRoll = student.rollNo.toLowerCase().includes(q);
          const matchName = student.name.toLowerCase().includes(q);
          const matchEmail = student.email.toLowerCase().includes(q);
          const matchDept = student.department.toLowerCase().includes(q);
          const matchCity = (student.city || '').toLowerCase().includes(q);
          if (!matchRoll && !matchName && !matchEmail && !matchDept && !matchCity) {
            return false;
          }
        }

        // Dept filter
        if (selectedDept !== 'ALL' && student.department !== selectedDept) {
          return false;
        }

        // Year filter
        if (selectedYear !== 'ALL' && student.year !== selectedYear) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'ALL' && student.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy];
        let valB: any = b[sortBy];

        if (typeof valA === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [students, searchQuery, selectedDept, selectedYear, selectedStatus, sortBy, sortOrder]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length && filteredStudents.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500 text-sm font-medium">Loading student records...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 pb-16">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Student Management System
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                CRUD operations, enrollment directory & records
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Export Dropdown / Buttons */}
            <button
              id="export-csv-btn"
              type="button"
              onClick={() => {
                exportStudentsToCSV(filteredStudents);
                addToast(`Exported ${filteredStudents.length} students to CSV`, 'info');
              }}
              className="inline-flex items-center px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors gap-1.5"
              title="Export filtered records to CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <button
              id="reset-sample-btn"
              type="button"
              onClick={handleResetData}
              className="inline-flex items-center px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors gap-1.5"
              title="Reset to default sample data"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden lg:inline">Reset Data</span>
            </button>

            {/* Add Student CTA */}
            <button
              id="open-add-student-btn"
              type="button"
              onClick={() => {
                setEditingStudent(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Statistics Bar */}
        <StatsBar students={students} />

        {/* Filter and Search Bar */}
        <div
          id="controls-container"
          className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs mb-5 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, roll number, department, email, city..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* View Switcher */}
            <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-0.5 self-end md:self-auto shrink-0 bg-slate-50">
              <button
                id="view-table-btn"
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                id="view-grid-btn"
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            {/* Department Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                id="filter-department"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-600"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Year of Study
              </label>
              <select
                id="filter-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-600"
              >
                <option value="ALL">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                id="filter-status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-blue-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Active Filter Clear & Count */}
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Results</span>
                <span className="text-xs font-semibold text-slate-700">
                  {filteredStudents.length} of {students.length} students
                </span>
              </div>
              {(selectedDept !== 'ALL' || selectedYear !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
                <button
                  id="reset-filters-btn"
                  type="button"
                  onClick={() => {
                    setSelectedDept('ALL');
                    setSelectedYear('ALL');
                    setSelectedStatus('ALL');
                    setSearchQuery('');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedIds.length > 0 && (
          <div
            id="bulk-action-bar"
            className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-sm shadow-xs animate-in fade-in"
          >
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">
                {selectedIds.length} student{selectedIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="bulk-status-active-btn"
                type="button"
                onClick={() => handleBulkStatusChange('Active')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-emerald-700 transition-colors"
              >
                Mark Active
              </button>
              <button
                id="bulk-status-inactive-btn"
                type="button"
                onClick={() => handleBulkStatusChange('Inactive')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-amber-700 transition-colors"
              >
                Mark Inactive
              </button>
              <button
                id="bulk-delete-btn"
                type="button"
                onClick={() => setIsBulkDeleteConfirmOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
              <button
                id="bulk-clear-selection-btn"
                type="button"
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Content View: Table or Grid */}
        {viewMode === 'table' ? (
          <StudentTable
            students={filteredStudents}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onView={(student) => setViewingStudent(student)}
            onEdit={(student) => {
              setEditingStudent(student);
              setIsAddModalOpen(true);
            }}
            onDelete={(student) => setDeletingStudent(student)}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        ) : (
          <StudentGrid
            students={filteredStudents}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onView={(student) => setViewingStudent(student)}
            onEdit={(student) => {
              setEditingStudent(student);
              setIsAddModalOpen(true);
            }}
            onDelete={(student) => setDeletingStudent(student)}
          />
        )}
      </main>

      {/* Modals */}
      {/* Create / Edit Student Modal */}
      <StudentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingStudent(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={editingStudent}
        existingStudents={students}
      />

      {/* Detail View Modal */}
      <StudentDetailModal
        isOpen={!!viewingStudent}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(student) => {
          setViewingStudent(null);
          setEditingStudent(student);
          setIsAddModalOpen(true);
        }}
        onDelete={(student) => {
          setViewingStudent(null);
          setDeletingStudent(student);
        }}
      />

      {/* Single Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deletingStudent}
        studentToDelete={deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleConfirmSingleDelete}
      />

      {/* Bulk Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isBulkDeleteConfirmOpen}
        bulkCount={selectedIds.length}
        onClose={() => setIsBulkDeleteConfirmOpen(false)}
        onConfirm={handleConfirmBulkDelete}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
