import * as React from 'react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(
  ({ className, indeterminate, onCheckedChange, checked = false, ...props }, ref) => {
    const innerRef = React.useRef(null);
    
    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = !!indeterminate;
      }
    }, [indeterminate]);
    
    const handleChange = (e) => {
      onCheckedChange?.(e.target.checked);
    };
    
    return (
      <div className="relative flex items-center">
        <input
          type="checkbox"
          ref={(el) => {
            if (typeof ref === 'function') {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
            innerRef.current = el;
          }}
          className={cn(
            'peer h-4 w-4 shrink-0 rounded-sm border border-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          checked={checked}
          onChange={handleChange}
          {...props}
        />
        <div className="absolute left-0 top-0 flex h-4 w-4 items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1L3.5 6.5L1 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
