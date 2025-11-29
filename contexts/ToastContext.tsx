import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/toast';
import { toastDispatcher } from '@/lib/toast-dispatcher';

interface ToastContextType {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  // Register toast functions globally so they can be used in axios interceptors
  useEffect(() => {
    toastDispatcher.setToastFunctions({
      success: toast.success,
      error: toast.error,
      info: toast.info,
    });
  }, [toast.success, toast.error, toast.info]);

  return (
    <ToastContext.Provider
      value={{
        success: toast.success,
        error: toast.error,
        info: toast.info,
      }}
    >
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}

