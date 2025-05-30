
import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, addDays } from "date-fns";
import { Clock, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar"; // Keeping Calendar for its complexity

const timeOptionsIST = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

const initialAvailability = [
  {
    date: new Date(),
    timeSlots: [
      { id: '1', startTime: '10:00', endTime: '11:00' },
      { id: '2', startTime: '14:00', endTime: '15:00' },
    ],
  },
  {
    date: addDays(new Date(), 2),
    timeSlots: [
      { id: '3', startTime: '09:00', endTime: '10:00' },
      { id: '4', startTime: '16:00', endTime: '17:00' },
    ],
  },
  {
    date: addDays(new Date(), 5),
    timeSlots: [
      { id: '5', startTime: '11:00', endTime: '12:00' },
    ],
  },
];

const TeacherAvailability = () => {
  const [availability, setAvailability] = useState(initialAvailability);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [activeTab, setActiveTab] = useState("slots");

  const getAvailabilityForDate = (date) => {
    return availability.find(
      (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const hasAvailability = (date) => {
    return availability.some(
      (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const handleAddTimeSlot = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date first",
        variant: "destructive",
      });
      return;
    }
    if (!newStartTime || !newEndTime) {
      toast({
        title: "Please select start and end times",
        variant: "destructive",
      });
      return;
    }

    const [startHour, startMinute] = newStartTime.split(':').map(Number);
    const [endHour, endMinute] = newEndTime.split(':').map(Number);

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      toast({
        title: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    const newSlot = {
      id: `slot-${Date.now()}`,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    setAvailability((prev) => {
      const existingDayIndex = prev.findIndex(
        (a) => format(a.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );

      if (existingDayIndex !== -1) {
        const updatedAvailability = [...prev];
        updatedAvailability[existingDayIndex] = {
          ...updatedAvailability[existingDayIndex],
          timeSlots: [...updatedAvailability[existingDayIndex].timeSlots, newSlot],
        };
        return updatedAvailability;
      } else {
        return [...prev, {
          date: selectedDate,
          timeSlots: [newSlot],
        }];
      }
    });

    setNewStartTime("");
    setNewEndTime("");
    setActiveTab("slots"); // Switch back to slots tab after adding
    toast({
      title: "Availability added",
    });
  };

  const handleRemoveTimeSlot = (dateToRemove, slotId) => {
    setAvailability((prev) => {
      const updatedAvailability = prev.map((day) => {
        if (format(day.date, 'yyyy-MM-dd') === format(dateToRemove, 'yyyy-MM-dd')) {
          return {
            ...day,
            timeSlots: day.timeSlots.filter((slot) => slot.id !== slotId),
          };
        }
        return day;
      });

      return updatedAvailability.filter((day) => day.timeSlots.length > 0);
    });

    toast({
      title: "Time slot removed",
    });
  };

  const createWeeklySlots = () => {
    const today = new Date();
    const weeklySlots = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      weeklySlots.push({
        date,
        timeSlots: [
          { id: `weekly-${i}-1`, startTime: '10:00', endTime: '11:00' },
          { id: `weekly-${i}-2`, startTime: '14:00', endTime: '15:00' },
        ],
      });
    }

    setAvailability(weeklySlots);
    toast({
      title: "Weekly schedule created",
      description: "Added 2 slots for each day this week",
    });
  };

  const handleDateSelect = (date) => {
    if (date instanceof Date) {
      setSelectedDate(date);
      setActiveTab("slots"); // Switch to slots tab after selecting a date
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md"
    >
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">Manage Your Availability</h1>
        <p className="text-gray-600 mb-6">Set and adjust your teaching schedule (Indian Standard Time - IST).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a Date</h3>
            <p className="text-sm text-gray-500 mb-4">Choose a date to view or modify your availability.</p>
            <div className="rounded-md shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="w-full rounded-md border border-gray-300"
                classNames={{
                  day: 'py-2 px-3 rounded-md focus:outline-none',
                  day_selected: 'bg-orange-500 text-white font-bold focus:outline-none', // Bold selected day
                  day_today: 'font-semibold text-orange-700', // Highlight today
                  day_disabled: 'text-gray-400 cursor-not-allowed',
                  month: 'pt-2',
                  year: 'pt-2',
                  caption: 'flex justify-center pt-2 pb-4 text-lg font-semibold text-gray-800',
                  nav: 'flex justify-between items-center p-2',
                  nav_button: 'rounded-md hover:bg-gray-100 focus:outline-none p-1 transition-colors',
                  nav_button_previous: 'mr-2',
                  nav_button_next: 'ml-2',
                  table: 'w-full border-collapse',
                  head_row: 'text-left',
                  head_cell: 'px-2 py-1 font-normal text-gray-600',
                  row: '',
                  cell: 'p-1 relative',
                }}
                modifiers={{
                  booked: (date) => hasAvailability(date),
                }}
                modifiersStyles={{
                  booked: { backgroundColor: 'rgba(251, 146, 60, 0.3)', fontWeight: 'bold', color: 'orange-800' } // More prominent booked days
                }}
                disabled={(date) => date < new Date() && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            <div className="mt-6">
              <button
                onClick={createWeeklySlots}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
              >
                Set Availability for the Week
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {selectedDate ? format(selectedDate, 'MMMM d') : 'Manage Time Slots'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Add, remove, or view time slots for the selected date (IST).
            </p>

            <div className="border-b border-gray-200 mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("slots")}
                  className={`py-2 px-4 rounded-t-md ${activeTab === "slots" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none`} // More emphasis on active tab
                >
                  Available Slots
                </button>
                <button
                  onClick={() => selectedDate && setActiveTab("add")}
                  className={`py-2 px-4 rounded-t-md ${activeTab === "add" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`} // More emphasis on active tab
                  disabled={!selectedDate}
                >
                  Add New Slot
                </button>
              </div>
            </div>

            {activeTab === "slots" && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-800 mb-3">
                  {hasAvailability(selectedDate) ? 'Available Time Slots (IST)' : 'No availability set for this date'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {getAvailabilityForDate(selectedDate)?.timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-semibold">{slot.startTime} - {slot.endTime}</span> {/* Bold time slots */}
                      </div>
                      <button
                        onClick={() => handleRemoveTimeSlot(selectedDate, slot.id)}
                        className="text-gray-500 hover:text-red-600 focus:outline-none" // Slightly darker red on hover
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {!hasAvailability(selectedDate) && (
                  <div className="py-6 flex justify-center">
  <button
    onClick={() => selectedDate && setActiveTab("add")}
    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center"
    disabled={!selectedDate}
  >
    <Plus className="h-4 w-4 mr-2" />
    <span>Add Time Slots</span>
  </button>
</div>
                )}
              </div>
            )}

            {activeTab === "add" && selectedDate && (
              <div className="mt-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-800">Add New Time Slot for {format(selectedDate, 'MMMM d')} (IST)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1"><span className="font-semibold">Start Time (IST)</span></label> {/* Bold label */}
                    <select
                      id="start-time"
                      value={newStartTime}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 font-semibold" // Bold select text
                    >
                      <option value="">Select start time</option>
                      {timeOptionsIST.map((time) => (
                        <option key={`start-${time}`} value={time} className="font-semibold">{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="font-semibold">End Time (IST)</span>
                    </label> 
                    <select
                      id="end-time"
                      value={newEndTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 font-semibold" // Bold select text
                    >
                      <option value="">Select end time</option>
                      {timeOptionsIST.map((time) => (
                        <option key={`end-${time}`} value={time} className="font-semibold">{time}</option> 
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddTimeSlot}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 mt-4 shadow-sm" // Already bold
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </button>
              </div>
            )}

            {activeTab === "add" && !selectedDate && (
              <div className="mt-4 text-gray-500 italic">
                Please select a date from the calendar to add new time slots (IST).
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-800 mb-3">Upcoming Availability (IST)</h4>
              <div className="flex flex-wrap gap-2">
                {availability
                  .filter((day) => day.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map((day, index) => (
                    <button
                      key={index}
                      onClick={() => { setSelectedDate(day.date); setActiveTab("slots"); }}
                      className={`inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none shadow-sm`}
                    >
                      <span className="font-semibold">{format(day.date, 'MMM d')}</span> ({day.timeSlots.length} slots)
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherAvailability;