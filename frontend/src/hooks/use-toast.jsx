import { useState, useEffect, createContext, useContext } from 'react';

const ToastContext = createContext({
  toasts: [],
  addToast: () => "",
  removeToast: () => {},
  updateToast: () => {},
});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      id,
      ...toast,
      onOpenChange: (open) => {
        if (!open) removeToast(id);
        toast.onOpenChange?.(open);
      },
    };

    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 3000);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const updateToast = (id, toast) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    );
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        updateToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    console.warn('useToast must be used within a ToastProvider');
    return {
      toast: (props) => {
        console.log('Toast:', props.title);
        return {
          id: 'fallback',
          dismiss: () => {},
          update: () => {},
        };
      },
      dismiss: () => {},
      toasts: [],
    };
  }

  return {
    toast: (props) => {
      const id = context.addToast(props);

      return {
        id,
        dismiss: () => context.removeToast(id),
        update: (props) => context.updateToast(id, props),
      };
    },
    dismiss: (toastId) => {
      if (toastId) {
        context.removeToast(toastId);
      } else {
        context.toasts.forEach((toast) => {
          context.removeToast(toast.id);
        });
      }
    },
    toasts: context.toasts,
  };
};

export const toast = (props) => {
  console.log('Toast:', props.title);

  return {
    id: 'direct-fallback',
    dismiss: () => {},
    update: () => {},
  };
};