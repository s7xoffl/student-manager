import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data/initialStudents';

const STORAGE_KEY = 'student_crud_app_records_v1';

export function loadStudents(): Student[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENTS;
  } catch (error) {
    console.error('Failed to load students from localStorage', error);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (error) {
    console.error('Failed to save students to localStorage', error);
  }
}

export function resetToDefaultStudents(): Student[] {
  saveStudents(INITIAL_STUDENTS);
  return INITIAL_STUDENTS;
}

export function exportStudentsToCSV(students: Student[]): void {
  const headers = [
    'Roll No',
    'Name',
    'Email',
    'Phone',
    'Department',
    'Year',
    'Semester',
    'GPA',
    'Gender',
    'Status',
    'City',
    'Enrollment Date',
  ];

  const rows = students.map((s) => [
    `"${s.rollNo}"`,
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    `"${s.department}"`,
    `"${s.year}"`,
    s.semester,
    s.gpa,
    `"${s.gender}"`,
    `"${s.status}"`,
    `"${s.city}"`,
    `"${s.enrollmentDate}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportStudentsToJSON(students: Student[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `students_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
