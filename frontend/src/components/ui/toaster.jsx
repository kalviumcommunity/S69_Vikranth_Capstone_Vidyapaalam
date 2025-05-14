import React from 'react';
import { Toast, ToastViewport } from './toast';
import { useToast } from '@/hooks/use-toast';

const Toaster = () => {
  const { toasts } = useToast();

  return (
    <ToastViewport>
      {toasts.map(({ id, title, description, action, onOpenChange, ...props }) => (
        <Toast
          key={id}
          id={id}
          title={title}
          description={description}
          action={action}
          onOpenChange={onOpenChange}
          {...props}
        />
      ))}
    </ToastViewport>
  );
};

export { Toaster };
