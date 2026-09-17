import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Student } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentToDelete?: Student | null;
  bulkCount?: number;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentToDelete,
  bulkCount,
}) => {
  if (!isOpen) return null;

  const isBulk = typeof bulkCount === 'number' && bulkCount > 0;

  return (
    <div
      id="delete-confirm-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="delete-confirm-dialog"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 relative"
      >
        <button
          id="close-delete-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isBulk ? `Delete ${bulkCount} Students?` : 'Delete Student Record?'}
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              {isBulk ? (
                <>
                  Are you sure you want to permanently delete{' '}
                  <span className="font-semibold text-slate-900">{bulkCount} selected students</span>?
                  This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete student{' '}
                  <span className="font-semibold text-slate-900">
                    {studentToDelete?.name} ({studentToDelete?.rollNo})
                  </span>
                  ? All associated records will be permanently removed.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-rose-600 text-white font-medium text-sm hover:bg-rose-700 active:bg-rose-800 shadow-xs transition-colors"
          >
            Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};
