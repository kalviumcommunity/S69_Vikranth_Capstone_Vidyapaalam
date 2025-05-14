import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Calendar({
  className,
  showOutsideDays = true,
  mode = "single",
  selected,
  onSelect,
  disabled,
  month,
  onMonthChange,
  modifiers,
  modifiersStyles,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(month || new Date());
  
  React.useEffect(() => {
    if (month) {
      setCurrentMonth(month);
    }
  }, [month]);

  const handleSelect = (date) => {
    if (onSelect) {
      if (mode === 'single') {
        onSelect(date);
      } else if (mode === 'multiple' && Array.isArray(selected)) {
        const isSelected = selected.some(
          (selectedDate) => selectedDate.toDateString() === date.toDateString()
        );
        
        if (isSelected) {
          onSelect(
            selected.filter(
              (selectedDate) => selectedDate.toDateString() !== date.toDateString()
            )
          );
        } else {
          onSelect([...selected, date]);
        }
      }
    }
  };

  const handleMonthChange = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
  };
  
  const daysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };
  
  const isSelected = (date) => {
    if (!selected) return false;
    
    if (Array.isArray(selected)) {
      return selected.some(d => d.toDateString() === date.toDateString());
    }
    
    if (selected instanceof Date) {
      return selected.toDateString() === date.toDateString();
    }
    
    return false;
  };
  
  const isDisabled = (date) => {
    return disabled ? disabled(date) : false;
  };
  
  const isToday = (date) => {
    return new Date().toDateString() === date.toDateString();
  };

  const checkModifier = (date, modifier) => {
    return modifiers && modifiers[modifier] ? modifiers[modifier](date) : false;
  };

  const getModifierStyles = (date) => {
    if (!modifiers || !modifiersStyles) return {};
    
    let styles = {};
    Object.keys(modifiers || {}).forEach(modifier => {
      if (checkModifier(date, modifier) && modifiersStyles && modifiersStyles[modifier]) {
        styles = { ...styles, ...modifiersStyles[modifier] };
      }
    });
    
    return styles;
  };
  
  return (
    <div className={cn("p-3 pointer-events-auto", className)}>
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={() => handleMonthChange(-1)}
          className="p-1 rounded-md hover:bg-gray-200"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="font-medium">
          {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
        </div>
        
        <button 
          onClick={() => handleMonthChange(1)}
          className="p-1 rounded-md hover:bg-gray-200"
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth().map((dayInfo, index) => {
          const { date, isCurrentMonth } = dayInfo;
          const isDateSelected = isSelected(date);
          const isDateToday = isToday(date);
          const isDateDisabled = isDisabled(date);
          const modifierStyles = getModifierStyles(date);
          
          return (
            <button
              key={index}
              type="button"
              disabled={isDateDisabled}
              onClick={() => !isDateDisabled && handleSelect(date)}
              className={cn(
                "h-8 w-8 rounded-md text-center text-sm p-0 font-normal",
                !isCurrentMonth && !showOutsideDays && "invisible",
                !isCurrentMonth && showOutsideDays && "text-gray-400 opacity-50",
                isDateToday && "bg-gray-200 text-gray-900",
                isDateSelected && "bg-blue-600 text-white",
                isDateDisabled && "text-gray-400 opacity-50 cursor-not-allowed",
                !isDateSelected && !isDateToday && !isDateDisabled && "hover:bg-gray-100"
              )}
              style={modifierStyles}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
