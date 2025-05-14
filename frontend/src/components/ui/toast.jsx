import React from 'react';
import { cn } from '@/lib/utils';

const Toast = React.forwardRef(({ className, variant = "default", title, description, action, id, onOpenChange, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all",
        variant === "default" && "bg-white text-gray-900 border-gray-200",
        variant === "destructive" && "bg-red-500 text-white border-red-600",
        variant === "success" && "bg-green-500 text-white border-green-600",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-1">
        {/* Add content here */}
      </div>
    </div>
  );
});

export const ToastViewport = () => {
  return <div></div>;
};

export { Toast };
