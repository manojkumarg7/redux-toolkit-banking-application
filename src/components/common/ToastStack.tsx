import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeToast, selectToasts } from '../../features/ui/uiSlice';
import { IconClose } from './Icons';

export function ToastStack() {
  const toasts = useAppSelector(selectToasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dispatch(removeToast(toast.id)), 3500),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`app-toast app-toast-${toast.type}`} role="status">
          <span>{toast.message}</span>
          <button
            type="button"
            className="btn btn-sm btn-link text-decoration-none p-0"
            aria-label="Dismiss notification"
            onClick={() => dispatch(removeToast(toast.id))}
          >
            <IconClose size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
