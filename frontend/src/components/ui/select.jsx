// import React from 'react';
// import { cn } from '@/lib/utils';

// const Select = React.forwardRef(({ className, children, onChange, onValueChange, ...props }, ref) => {
//   const handleChange = (event) => {
//     onChange?.(event);
//     onValueChange?.(event.target.value);
//   };

//   return (
//     <select
//       ref={ref}
//       onChange={handleChange}
//       className={cn(
//         'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </select>
//   );
// });

// export const SelectTrigger = ({ children }) => {
//   return <button>{children}</button>;
// };

// export const SelectContent = ({ children }) => {
//   return <div>{children}</div>;
// };

// export const SelectItem = ({ id, children }) => {
//   const menuItems = {
//     'save-page': 'Save Page',
//     'translate-page': 'Translate Page',
//   };

//   if (!menuItems[id]) {
//     console.warn(`Cannot find menu item with id "${id}". Rendering fallback.`);
//     return <div id={id} className="text-muted">Unknown Item</div>; // Render a fallback UI
//   }

//   return <div id={id}>{children || menuItems[id]}</div>;
// };

// export const SelectValue = ({ value }) => {
//   return <span>{value}</span>;
// };

// export { Select };


import React, { forwardRef, useState, useRef, useEffect } from 'react';

const Select = forwardRef(({ className, children, onChange, onValueChange, value, ...props }, ref) => {
  const handleChange = (event) => {
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  const mergedClasses = `flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`;

  return (
    <select
      ref={ref}
      onChange={handleChange}
      className={mergedClasses}
      value={value}
      {...props}
    >
      {children}
    </select>
  );
});

export const SelectTrigger = ({ children, onClick }) => {
  return <button className="border rounded px-4 py-2" onClick={onClick}>{children}</button>;
};

export const SelectContent = ({ children, isOpen }) => {
    return isOpen && <div className="border rounded shadow-md mt-1 p-2 bg-white">{children}</div>;
};

export const SelectItem = ({ id, children, value, onClick }) => {
  return <div id={id} value={value} className="px-3 py-2 hover:bg-gray-100 cursor-pointer" onClick={onClick}>{children}</div>;
};

export const SelectValue = ({ value }) => {
  return <span>{value}</span>;
};

export const DropdownSelect = ({ options, onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div ref={dropdownRef}>
      <SelectTrigger onClick={handleTriggerClick}>
        <SelectValue value={selectedValue || "Select an option"} />
      </SelectTrigger>
      <SelectContent isOpen={isOpen}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            onClick={() => handleItemClick(option.value)}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </div>
  );
};

export { Select };