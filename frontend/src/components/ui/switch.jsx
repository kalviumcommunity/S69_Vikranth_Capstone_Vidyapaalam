import React from 'react';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
  const handleChange = (event) => {
    onCheckedChange?.(event.target.checked);
  };

  return (
    <label className={cn('inline-flex items-center cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <div className={cn(
          "block w-11 h-6 rounded-full transition-colors",
          checked ? "bg-blue-600" : "bg-gray-300"
        )}></div>
        <div className={cn(
          "absolute left-1 top-1 bg-white rounded-full w-4 h-4 transition-transform",
          checked ? "transform translate-x-5" : ""
        )}></div>
      </div>
    </label>
  );
});

export { Switch };
