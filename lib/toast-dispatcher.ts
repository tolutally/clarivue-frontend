// Global toast dispatcher that can be used outside React context (e.g., in axios interceptors)

type ToastFunction = (title: string, description?: string) => void;

let toastFunctions: {
  success: ToastFunction;
  error: ToastFunction;
  info: ToastFunction;
} | null = null;

export const toastDispatcher = {
  setToastFunctions: (functions: { success: ToastFunction; error: ToastFunction; info: ToastFunction }) => {
    toastFunctions = functions;
  },

  success: (title: string, description?: string) => {
    if (toastFunctions) {
      toastFunctions.success(title, description);
    } else {
      console.warn('Toast functions not initialized. Toast:', title, description);
    }
  },

  error: (title: string, description?: string) => {
    if (toastFunctions) {
      toastFunctions.error(title, description);
    } else {
      console.warn('Toast functions not initialized. Toast:', title, description);
    }
  },

  info: (title: string, description?: string) => {
    if (toastFunctions) {
      toastFunctions.info(title, description);
    } else {
      console.warn('Toast functions not initialized. Toast:', title, description);
    }
  },
};

