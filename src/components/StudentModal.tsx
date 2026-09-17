import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Student, Department, YearOfStudy, Gender, StudentStatus } from '../types';
import { DEPARTMENTS } from '../data/initialStudents';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  studentToEdit?: Student | null;
  existingStudents: Student[];
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
  existingStudents,
}) => {
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<Department>('Computer Science');
  const [year, setYear] = useState<YearOfStudy>('1st Year');
  const [semester, setSemester] = useState<number>(1);
  const [gpa, setGpa] = useState<string>('8.0');
  const [gender, setGender] = useState<Gender>('Male');
  const [status, setStatus] = useState<StudentStatus>('Active');
  const [city, setCity] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (studentToEdit) {
      setRollNo(studentToEdit.rollNo);
      setName(studentToEdit.name);
      setEmail(studentToEdit.email);
      setPhone(studentToEdit.phone);
      setDepartment(studentToEdit.department);
      setYear(studentToEdit.year);
      setSemester(studentToEdit.semester);
      setGpa(studentToEdit.gpa.toString());
      setGender(studentToEdit.gender);
      setStatus(studentToEdit.status);
      setCity(studentToEdit.city || '');
      setEnrollmentDate(studentToEdit.enrollmentDate || new Date().toISOString().split('T')[0]);
      setNotes(studentToEdit.notes || '');
    } else {
      // Defaults for new student
      setRollNo('');
      setName('');
      setEmail('');
      setPhone('');
      setDepartment('Computer Science');
      setYear('1st Year');
      setSemester(1);
      setGpa('8.0');
      setGender('Male');
      setStatus('Active');
      setCity('');
      setEnrollmentDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setErrors({});
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!rollNo.trim()) {
      newErrors.rollNo = 'Roll Number is required';
    } else {
      // Check duplicate rollNo
      const isDuplicate = existingStudents.some(
        (s) =>
          s.rollNo.trim().toLowerCase() === rollNo.trim().toLowerCase() &&
          s.id !== studentToEdit?.id
      );
      if (isDuplicate) {
        newErrors.rollNo = 'This Roll Number is already registered';
      }
    }

    if (!name.trim()) {
      newErrors.name = 'Student Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 10) {
      newErrors.gpa = 'GPA must be between 0.0 and 10.0';
    }

    if (!city.trim()) {
      newErrors.city = 'City/Location is required';
    }

    if (!enrollmentDate) {
      newErrors.enrollmentDate = 'Enrollment date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const student: Student = {
      id: studentToEdit ? studentToEdit.id : `STU-${Date.now().toString().slice(-5)}`,
      rollNo: rollNo.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department,
      year,
      semester: Number(semester),
      gpa: Math.round(parseFloat(gpa) * 100) / 100,
      gender,
      status,
      city: city.trim(),
      enrollmentDate,
      notes: notes.trim(),
    };

    onSave(student);
    onClose();
  };

  // Auto adjust semester according to year
  const handleYearChange = (newYear: YearOfStudy) => {
    setYear(newYear);
    if (newYear === '1st Year' && (semester < 1 || semester > 2)) setSemester(1);
    else if (newYear === '2nd Year' && (semester < 3 || semester > 4)) setSemester(3);
    else if (newYear === '3rd Year' && (semester < 5 || semester > 6)) setSemester(5);
    else if (newYear === '4th Year' && (semester < 7 || semester > 8)) setSemester(7);
  };

  return (
    <div
      id="student-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="student-modal-dialog"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {studentToEdit ? 'Edit Student Details' : 'Register New Student'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {studentToEdit
                ? 'Update academic, contact, or status information.'
                : 'Enter all details to enroll a new student to the records.'}
            </p>
          </div>
          <button
            id="close-modal-btn"
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Roll Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Roll / Reg Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-roll-no"
                type="text"
                placeholder="e.g. 23CS101"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.rollNo
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.rollNo && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.rollNo}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.name
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.name && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-email"
                type="email"
                placeholder="e.g. student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.email && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-phone"
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.phone
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.phone && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department / Branch <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-year"
                value={year}
                onChange={(e) => handleYearChange(e.target.value as YearOfStudy)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Semester (1 - 8)
              </label>
              <input
                id="input-semester"
                type="number"
                min="1"
                max="8"
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* GPA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                GPA / CGPA (0.00 - 10.00) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-gpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                placeholder="e.g. 8.75"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.gpa
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.gpa && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.gpa}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                id="select-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Enrollment Status
              </label>
              <select
                id="select-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* City / Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                City / Location <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-city"
                type="text"
                placeholder="e.g. Chennai, Coimbatore, etc."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:ring-2 transition-all ${
                  errors.city
                    ? 'border-rose-400 bg-rose-50/30 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-blue-100'
                }`}
              />
              {errors.city && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.city}
                </p>
              )}
            </div>

            {/* Enrollment Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Enrollment Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-enrollment-date"
                type="date"
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
              />
              {errors.enrollmentDate && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                  {errors.enrollmentDate}
                </p>
              )}
            </div>
          </div>

          {/* Notes / Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Remarks / Achievements / Notes
            </label>
            <textarea
              id="input-notes"
              rows={2}
              placeholder="e.g. Extracurricular achievements, scholarships, special skills..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              id="cancel-student-btn"
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-student-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:bg-blue-800 shadow-xs transition-colors"
            >
              {studentToEdit ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
