import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, startOfDay, parseISO } from "date-fns";
import { Clock, Plus, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";

const timeSlots = [
  "00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00",
  "05:00-06:00", "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
  "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00",
  "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
  "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00",
];

const TeacherAvailability = () => {
  const { api, updateAvailability } = useAuth();
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [activeTab, setActiveTab] = useState("slots");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        if (data && Array.isArray(data.availability)) {
          const mappedAvailability = data.availability
            .map((day) => {
              if (!day.date) return null;
              const parsedDate = parseISO(day.date);
              if (isNaN(parsedDate.getTime())) return null;
              return {
                date: startOfDay(parsedDate),
                timeSlots: (day.slots || []).map((slot) => ({
                  id: slot.id || `slot-${parsedDate.getTime()}-${slot.startTime}-${Math.random()}`,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              };
            })
            .filter((day) => day !== null);
          setAvailability(mappedAvailability);
          if (mappedAvailability.length === 0 && data.availability.length > 0) {
            alert("No valid availability data found: Availability data was returned but filtered out due to invalid format.");
          }
        } else {
          setAvailability([]);
          alert("No availability data found: No valid data returned from the server.");
        }
      } catch (err) {
        alert(`Failed to fetch availability: ${err.response?.data?.message || "Please try again later."}`);
        setAvailability([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [api]);

  const getAvailabilityForDate = (date) =>
    availability.find((a) => format(a.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));

  const hasAvailability = (date) =>
    availability.some((a) => format(a.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));

  const handleSlotToggle = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleAddTimeSlots = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      alert(!selectedDate ? "Please select a valid date" : "Please select at least one time slot");
      return;
    }

    const newSlots = selectedSlots.map((slot) => {
      const [startTime, endTime] = slot.split("-");
      return { id: `slot-${Date.now()}-${Math.random()}`, startTime, endTime };
    });

    let updatedAvailability = [...availability];
    const dayIndex = availability.findIndex(
      (a) => format(a.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
    );

    if (dayIndex !== -1) {
      const filteredNewSlots = newSlots.filter(
        (ns) =>
          !updatedAvailability[dayIndex].timeSlots.some(
            (es) => es.startTime === ns.startTime && es.endTime === ns.endTime
          )
      );
      if (filteredNewSlots.length === 0) {
        alert("No new slots to add: All selected slots already exist for this date.");
        return;
      }
      updatedAvailability[dayIndex].timeSlots = [
        ...updatedAvailability[dayIndex].timeSlots,
        ...filteredNewSlots,
      ];
    } else {
      updatedAvailability.push({ date: startOfDay(selectedDate), timeSlots: newSlots });
    }

    const backendAvailability = updatedAvailability.map((day) => ({
      date: format(day.date, "yyyy-MM-dd"),
      slots: day.timeSlots.map((slot) => ({ startTime: slot.startTime, endTime: slot.endTime })),
    }));

    try {
      await updateAvailability(backendAvailability);
      setAvailability(updatedAvailability);
      setSelectedSlots([]);
      setActiveTab("slots");
      alert(`Availability added successfully: ${newSlots.length} slot(s) added for ${format(selectedDate, "MMMM d")}.`);
    } catch (err) {
      alert(`Failed to add availability: ${err.response?.data?.message || "Please try again."}`);
    }
  };

  const handleRemoveTimeSlot = async (dateToRemove, slotId) => {
    const dayAvailability = getAvailabilityForDate(dateToRemove);
    if (!dayAvailability) {
      alert("No availability found for the selected date.");
      return;
    }

    const slotToRemove = dayAvailability.timeSlots.find((slot) => slot.id === slotId);
    if (!slotToRemove) {
      alert("The slot you are trying to remove does not exist.");
      return;
    }

    const confirm = window.confirm(
      `Remove slot ${slotToRemove.startTime} - ${slotToRemove.endTime} for ${format(dateToRemove, "MMMM d")}?`
    );
    if (!confirm) return;

    const updatedAvailability = availability
      .map((day) =>
        format(day.date, "yyyy-MM-dd") === format(dateToRemove, "yyyy-MM-dd")
          ? { ...day, timeSlots: day.timeSlots.filter((slot) => slot.id !== slotId) }
          : day
      )
      .filter((day) => day.timeSlots.length > 0);

    const backendAvailability = updatedAvailability.map((day) => ({
      date: format(day.date, "yyyy-MM-dd"),
      slots: day.timeSlots.map((slot) => ({ startTime: slot.startTime, endTime: slot.endTime })),
    }));

    try {
      await updateAvailability(backendAvailability);
      setAvailability(updatedAvailability);
      alert("Time slot removed successfully.");
    } catch (err) {
      alert(`Failed to remove time slot: ${err.response?.data?.message || "Please try again."}`);
    }
  };

  const handleDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(startOfDay(date));
      setActiveTab("slots");
      setSelectedSlots([]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md">
        <style>
          {`
            .skeleton {
              animation: pulse 1.5s ease-in-out infinite;
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
            }
            @keyframes pulse {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @media (forced-colors: active) {
              .skeleton {
                forced-color-adjust: none;
                background: Canvas;
                animation: none;
                border: 1px solid ButtonBorder;
              }
            }
          `}
        </style>
        <div className="text-center">
          <div className="h-8 w-3/4 mx-auto skeleton rounded-md" />
          <div className="h-4 w-1/2 mx-auto skeleton rounded-md mt-3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 space-y-4">
              <div className="h-6 w-1/3 skeleton rounded-md" />
              <div className="h-4 w-2/3 skeleton rounded-md" />
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="h-10 w-full skeleton rounded-md" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 space-y-4">
              <div className="h-6 w-1/3 skeleton rounded-md" />
              <div className="h-4 w-2/3 skeleton rounded-md" />
              <div className="flex gap-2">
                <div className="h-8 w-24 skeleton rounded-md" />
                <div className="h-8 w-24 skeleton rounded-md" />
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 w-full skeleton rounded-md" />
                ))}
              </div>
              <div className="h-6 w-1/3 skeleton rounded-md" />
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 w-24 skeleton rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md"
    >
      <style>
        {`
          @media (forced-colors: active) {
            .bg-orange-500 {
              forced-color-adjust: none;
              background-color: ButtonFace;
              color: ButtonText;
              border: 2px solid ButtonText;
            }
            .bg-orange-500:hover {
              background-color: Highlight;
              color: HighlightText;
            }
            .text-orange-600 {
              forced-color-adjust: none;
              color: ButtonText;
            }
            .bg-gray-100 {
              forced-color-adjust: none;
              background-color: ButtonFace;
            }
            .border-orange-600 {
              forced-color-adjust: none;
              border-color: ButtonText;
            }
            .text-gray-700 {
              forced-color-adjust: none;
              color: ButtonText;
            }
            .text-gray-600 {
              forced-color-adjust: none;
              color: ButtonText;
            }
            .bg-gray-50 {
              forced-color-adjust: none;
              background-color: Canvas;
            }
            .border-gray-300 {
              forced-color-adjust: none;
              border-color: ButtonBorder;
            }
            .text-gray-500 {
              forced-color-adjust: none;
              color: GrayText;
            }
            .hover\\:text-red-600:hover {
              forced-color-adjust: none;
              color: Highlight;
            }
            .focus\\:ring-orange-400 {
              outline: 2px solid Highlight;
            }
            .day_selected {
              forced-color-adjust: none;
              background-color: Highlight;
              color: HighlightText;
            }
            .day_today {
              forced-color-adjust: none;
              color: ButtonText;
              font-weight: bold;
            }
            .day_disabled {
              forced-color-adjust: none;
              color: GrayText;
            }
            .booked {
              forced-color-adjust: none;
              background-color: ButtonFace;
              border: 1px solid ButtonText;
              color: ButtonText;
            }
            .upcoming-availability {
              max-height: 150px;
              overflow-y: auto;
              padding-right: 8px;
            }
            .slot-selected, .slot-booked {
              background-color: #3b82f6;
              color: white;
            }
          }
        `}
      </style>
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
                  day_selected: 'bg-orange-500 text-white font-bold focus:outline-none',
                  day_today: 'font-semibold text-orange-700',
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
                  booked: { backgroundColor: 'rgba(251, 146, 60, 0.3)', fontWeight: 'bold', color: 'orange-800' }
                }}
                disabled={(date) => date < new Date() && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')}
              />
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
                  className={`py-2 px-4 rounded-t-md ${activeTab === "slots" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none`}
                >
                  Available Slots
                </button>
                <button
                  onClick={() => selectedDate && setActiveTab("add")}
                  className={`py-2 px-4 rounded-t-md ${activeTab === "add" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!selectedDate}
                >
                  Add New Slots
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
                        <span className="font-semibold">{slot.startTime} - {slot.endTime}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveTimeSlot(selectedDate, slot.id)}
                        className="text-gray-500 hover:text-red-600 focus:outline-none"
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
                <h4 className="text-sm font-medium text-gray-800">Add Time Slots for {format(selectedDate, 'MMMM d')} (IST)</h4>
                <p className="text-sm text-gray-500">Select one or more time slots to add.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => {
                    const isBooked = getAvailabilityForDate(selectedDate)?.timeSlots.some(
                      (s) => `${s.startTime}-${s.endTime}` === slot
                    );
                    const isSelected = selectedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => !isBooked && handleSlotToggle(slot)}
                        className={`py-2 px-3 rounded-md border border-gray-300 text-sm font-semibold ${
                          isBooked ? 'slot-booked cursor-not-allowed' : isSelected ? 'slot-selected' : 'bg-white hover:bg-gray-100'
                        }`}
                        disabled={isBooked}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleAddTimeSlots}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 mt-4 shadow-sm"
                  disabled={selectedSlots.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2 inline" />
                  Add {selectedSlots.length} Slot{selectedSlots.length !== 1 ? 's' : ''}
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
              {availability.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming availability set.</p>
              ) : (
                <div className="flex flex-wrap gap-2 upcoming-availability">
                  {availability
                    .filter((day) => day.date >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((day, index) => (
                      <button
                        key={index}
                        onClick={() => { setSelectedDate(day.date); setActiveTab("slots"); }}
                        className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none shadow-sm"
                      >
                        <span className="font-semibold">{format(day.date, 'MMM d')}</span> ({day.timeSlots.length} slots)
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherAvailability;
