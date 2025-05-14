import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const Sheet = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            onOpenChange: handleOpenChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const SheetContent = ({
  side = 'right',
  isOpen,
  onOpenChange,
  className,
  children,
  ...props
}) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onOpenChange?.(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          'fixed z-50 bg-background shadow-lg duration-300 ease-in-out',
          {
            'top-0 left-0 right-0 h-auto border-b': side === 'top',
            'top-0 bottom-0 right-0 h-full w-72 border-l': side === 'right',
            'bottom-0 left-0 right-0 h-auto border-t': side === 'bottom',
            'top-0 bottom-0 left-0 h-full w-72 border-r': side === 'left',
          },
          className
        )}
        {...props}
      >
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={() => onOpenChange?.(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export { Sheet, SheetContent };
