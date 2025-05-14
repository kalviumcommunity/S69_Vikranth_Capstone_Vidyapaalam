import * as React from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(
  (
    { 
      className, 
      max = 100, 
      min = 0, 
      step = 1, 
      defaultValue = [0], 
      value, 
      onValueChange,
      onChange,
      orientation = 'horizontal',
      ...props 
    }, 
    ref
  ) => {
    const initialValue = React.useMemo(() => {
      if (value !== undefined) {
        return value[0];
      }
      if (defaultValue !== undefined) {
        return defaultValue[0];
      }
      return min;
    }, [defaultValue, min, value]);
    
    const [internalValue, setInternalValue] = React.useState(initialValue);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value[0]);
      }
    }, [value]);

    const handleChange = (e) => {
      const newValue = parseFloat(e.target.value);
      setInternalValue(newValue);
      
      if (onChange) {
        onChange(e);
      }
      
      if (onValueChange) {
        onValueChange([newValue]);
      }
    };

    const percentage = ((internalValue - min) / (max - min)) * 100;

    return (
      <div
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          orientation === 'vertical' ? 'h-full' : '',
          className
        )}
      >
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          className={cn(
            'w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600'
          )}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
