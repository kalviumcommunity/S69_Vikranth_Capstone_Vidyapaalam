import * as React from 'react';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef(({ className, children, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    className={cn('relative overflow-auto', className)}
    {...props}
  >
    {children}
  </div>
));
ScrollArea.displayName = 'ScrollArea';

const ScrollBar = React.forwardRef(({ className, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex touch-none select-none',
      orientation === 'vertical' ?
        'h-full w-2.5 border-l border-l-transparent p-[1px]' :
        'h-2.5 border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  />
));
ScrollBar.displayName = 'ScrollBar';

export { ScrollArea, ScrollBar };
