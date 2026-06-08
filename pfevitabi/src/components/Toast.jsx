import { useCallback, useEffect, useMemo, useState } from 'react';
import { ToastContext } from '../ToastStore';
import './Toast.css';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

const DEFAULT_DURATION = 4000;

function ToastItem({ toast, onDismiss }) {
  const [leaving, setLeaving] = useState(false);

  const handleDismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, toast.duration ?? DEFAULT_DURATION);
    return () => clearTimeout(timer);
  }, [handleDismiss, toast.duration]);

  return (
    <div
      className={`toast toast--${toast.type} ${leaving ? 'toast--leaving' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <span className="toast__icon" aria-hidden="true">
        {ICONS[toast.type] ?? ICONS.info}
      </span>
      <p className="toast__message">{toast.message}</p>
      <button
        type="button"
        className="toast__close"
        onClick={handleDismiss}
        aria-label="Fermer la notification"
      >
        ×
      </button>
      <span className="toast__progress" style={{ animationDuration: `${toast.duration ?? DEFAULT_DURATION}ms` }} />
    </div>
  );
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration) => {
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const value = useMemo(() => ({
    showToast,
    success: (m, d) => showToast(m, 'success', d),
    error: (m, d) => showToast(m, 'error', d),
    warning: (m, d) => showToast(m, 'warning', d),
    info: (m, d) => showToast(m, 'info', d),
  }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
