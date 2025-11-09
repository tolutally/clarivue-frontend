import { useState, useCallback } from 'react';
import type { ToastProps } from '../components/ui/toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
      const id = Math.random().toString(36).substring(7);
      const duration = toast.duration || 3000;

      setToasts((prev) => [
        ...prev,
        { ...toast, id, onClose: () => {} },
      ]);

      setTimeout(() => {
        removeToast(id);
      }, duration);

      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'success' });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'error' });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      addToast({ title, description, type: 'info' });
    },
    [addToast]
  );

  return {
    toasts,
    removeToast,
    success,
    error,
    info,
  };
}
