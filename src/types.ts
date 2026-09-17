export type Department =
  | 'Computer Science'
  | 'Information Technology'
  | 'Electronics & Communication'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Electrical & Electronics'
  | 'Artificial Intelligence & Data Science'
  | 'Biotechnology';

export type YearOfStudy = '1st Year' | '2nd Year' | '3rd Year' | '4th Year';

export type StudentStatus = 'Active' | 'Inactive' | 'Graduated' | 'Suspended';

export type Gender = 'Male' | 'Female' | 'Other';

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  year: YearOfStudy;
  semester: number;
  gpa: number; // e.g. 8.75 or 3.8
  gender: Gender;
  status: StudentStatus;
  city: string;
  enrollmentDate: string; // YYYY-MM-DD
  notes?: string;
}

export type SortField = 'rollNo' | 'name' | 'department' | 'year' | 'gpa' | 'enrollmentDate' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  department: string;
  year: string;
  status: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export interface StudentFormData {
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  department: Department;
  year: YearOfStudy;
  semester: number;
  gpa: string | number;
  gender: Gender;
  status: StudentStatus;
  city: string;
  enrollmentDate: string;
  notes?: string;
}
