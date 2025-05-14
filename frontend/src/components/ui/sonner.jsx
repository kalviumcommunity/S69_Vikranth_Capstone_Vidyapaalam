import React from 'react';

export const Toaster = ({ className, ...props }) => {
  // A simplified sonner-like toaster component
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      {...props}
    />
  );
};

// Simple toast function that uses our custom toast system
export const toast = (message, options) => {
  const { showToast } = require('@/lib/utils');
  showToast(message, options?.type || 'info');
};
