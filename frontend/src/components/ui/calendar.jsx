import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.toDateString() === date2.toDateString();
};

const isSameMonth = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const days = [];
  const startDayIndex = firstDayOfMonth.getDay();
  for (let i = 0; i < startDayIndex; i++) {
    const prevDate = new Date(year, month, 1 - (startDayIndex - i));
    days.push({
      date: prevDate,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({
      date: nextDate,
      isCurrentMonth: false,
    });
  }

  return days;
};

function Calendar({
  className,
  showOutsideDays = true,
  mode = "single",
  selected,
  onSelect,
  disabled,
  month: controlledMonth,
  onMonthChange,
  modifiers,
  modifiersStyles,
  ...props
}) {
  const [currentMonth, setCurrentMonth] = React.useState(controlledMonth || new Date());

  React.useEffect(() => {
    if (controlledMonth && !isSameMonth(currentMonth, controlledMonth)) {
      setCurrentMonth(controlledMonth);
    }
  }, [controlledMonth, currentMonth]);

  const handleSelect = React.useCallback((date) => {
    if (!onSelect) return;

    if (mode === 'single') {
      onSelect(date);
    } else if (mode === 'multiple') {
      const currentSelected = Array.isArray(selected) ? selected : [];
      const isAlreadySelected = currentSelected.some(d => isSameDay(d, date));

      if (isAlreadySelected) {
        onSelect(currentSelected.filter(d => !isSameDay(d, date)));
      } else {
        onSelect([...currentSelected, date]);
      }
    }
  }, [mode, selected, onSelect]);

  const handleMonthChange = React.useCallback((increment) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      if (onMonthChange) {
        onMonthChange(newMonth);
      }
      return newMonth;
    });
  }, [onMonthChange]);

  const isDateSelected = React.useCallback((date) => {
    if (mode === 'single' && selected instanceof Date) {
      return isSameDay(selected, date);
    }
    if (mode === 'multiple' && Array.isArray(selected)) {
      return selected.some(d => isSameDay(d, date));
    }
    return false;
  }, [mode, selected]);

  const isDateDisabled = React.useCallback((date) => {
    return disabled ? disabled(date) : false;
  }, [disabled]);

  const isDateToday = React.useCallback((date) => {
    return isSameDay(new Date(), date);
  }, []);

  const checkModifier = React.useCallback((date, modifierName) => {
    return modifiers && modifiers[modifierName] ? modifiers[modifierName](date) : false;
  }, [modifiers]);

  const getCombinedModifierStyles = React.useCallback((date) => {
    if (!modifiersStyles) return {};

    let styles = {};
    for (const modifierName in modifiersStyles) {
      if (Object.prototype.hasOwnProperty.call(modifiersStyles, modifierName) && checkModifier(date, modifierName)) {
        styles = { ...styles, ...modifiersStyles[modifierName] };
      }
    }
    return styles;
  }, [modifiersStyles, checkModifier]);

  const days = React.useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  return (
    <div className={cn("p-3 pointer-events-auto", className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => handleMonthChange(-1)}
          className="p-1 rounded-md hover:bg-gray-200"
          type="button"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div
          className="font-medium text-gray-900"
          role="heading"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>

        <button
          onClick={() => handleMonthChange(1)}
          className="p-1 rounded-md hover:bg-gray-200"
          type="button"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="font-medium text-gray-500" aria-label={day === 'Su' ? 'Sunday' : day === 'Mo' ? 'Monday' : day === 'Tu' ? 'Tuesday' : day === 'We' ? 'Wednesday' : day === 'Th' ? 'Thursday' : day === 'Fr' ? 'Friday' : 'Saturday'}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dayInfo, index) => {
          const { date, isCurrentMonth } = dayInfo;
          const selected = isDateSelected(date);
          const today = isDateToday(date);
          const disabledDate = isDateDisabled(date);
          const modifierStyles = getCombinedModifierStyles(date);

          const isVisible = showOutsideDays || isCurrentMonth;

          if (!isVisible) {
            return <div key={index} className="h-8 w-8" aria-hidden="true" />;
          }

          return (
            <button
              key={index}
              type="button"
              disabled={disabledDate}
              onClick={() => handleSelect(date)}
              aria-label={date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              className={cn(
                "h-8 w-8 rounded-md text-center text-sm p-0 font-normal transition-colors duration-100 ease-in-out",
                isCurrentMonth ? "text-gray-900" : (showOutsideDays ? "text-gray-400 opacity-50" : "hidden"),
                "hover:bg-gray-100",
                today && "bg-gray-200 text-gray-900 font-semibold",
                selected && "bg-blue-600 text-white hover:bg-blue-700",
                disabledDate && "text-gray-400 cursor-not-allowed opacity-50 bg-transparent hover:bg-transparent",
                selected && today && "bg-blue-600 text-white",
                Object.keys(modifierStyles).length > 0 && "relative overflow-hidden z-0",
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