import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-600 text-white shadow-emerald-500/20';
      case 'error':
        return 'bg-rose-600 text-white shadow-rose-500/20';
      case 'info':
        return 'bg-blue-600 text-white shadow-blue-500/20';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${getStyle()}`}
    >
      {getIcon()}
      <span>{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="ml-2 p-0.5 rounded-md hover:bg-white/20 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
