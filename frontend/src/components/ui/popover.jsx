import * as React from 'react';
import { cn } from '@/lib/utils';

const Popover = ({ children }) => {
  return <>{children}</>;
};
Popover.displayName = 'Popover';

const PopoverTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button ref={ref} className={cn('inline-flex', className)} {...props} />
));
PopoverTrigger.displayName = 'PopoverTrigger';

const PopoverContent = React.forwardRef(
  ({ className, align = 'center', side = 'bottom', sideOffset = 4, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
          'animate-in fade-in-50',
          className
        )}
        {...props}
      />
    );
  }
);
PopoverContent.displayName = 'PopoverContent';

export { Popover, PopoverTrigger, PopoverContent };
