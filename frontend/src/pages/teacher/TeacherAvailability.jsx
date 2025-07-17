
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { format, addDays } from "date-fns";
// import { Clock, Plus, X } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import { Calendar } from "@/components/ui/calendar"; 

// const timeOptionsIST = [
//   "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
//   "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
//   "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
// ];

// const initialAvailability = [
//   {
//     date: new Date(),
//     timeSlots: [
//       { id: '1', startTime: '10:00', endTime: '11:00' },
//       { id: '2', startTime: '14:00', endTime: '15:00' },
//     ],
//   },
//   {
//     date: addDays(new Date(), 2),
//     timeSlots: [
//       { id: '3', startTime: '09:00', endTime: '10:00' },
//       { id: '4', startTime: '16:00', endTime: '17:00' },
//     ],
//   },
//   {
//     date: addDays(new Date(), 5),
//     timeSlots: [
//       { id: '5', startTime: '11:00', endTime: '12:00' },
//     ],
//   },
// ];

// const TeacherAvailability = () => {
//   const [availability, setAvailability] = useState(initialAvailability);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [newStartTime, setNewStartTime] = useState("");
//   const [newEndTime, setNewEndTime] = useState("");
//   const [activeTab, setActiveTab] = useState("slots");

//   const getAvailabilityForDate = (date) => {
//     return availability.find(
//       (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
//     );
//   };

//   const hasAvailability = (date) => {
//     return availability.some(
//       (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
//     );
//   };

//   const handleAddTimeSlot = () => {
//     if (!selectedDate) {
//       toast({
//         title: "Please select a date first",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!newStartTime || !newEndTime) {
//       toast({
//         title: "Please select start and end times",
//         variant: "destructive",
//       });
//       return;
//     }

//     const [startHour, startMinute] = newStartTime.split(':').map(Number);
//     const [endHour, endMinute] = newEndTime.split(':').map(Number);

//     if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
//       toast({
//         title: "End time must be after start time",
//         variant: "destructive",
//       });
//       return;
//     }

//     const newSlot = {
//       id: `slot-${Date.now()}`,
//       startTime: newStartTime,
//       endTime: newEndTime,
//     };

//     setAvailability((prev) => {
//       const existingDayIndex = prev.findIndex(
//         (a) => format(a.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
//       );

//       if (existingDayIndex !== -1) {
//         const updatedAvailability = [...prev];
//         updatedAvailability[existingDayIndex] = {
//           ...updatedAvailability[existingDayIndex],
//           timeSlots: [...updatedAvailability[existingDayIndex].timeSlots, newSlot],
//         };
//         return updatedAvailability;
//       } else {
//         return [...prev, {
//           date: selectedDate,
//           timeSlots: [newSlot],
//         }];
//       }
//     });

//     setNewStartTime("");
//     setNewEndTime("");
//     setActiveTab("slots"); // Switch back to slots tab after adding
//     toast({
//       title: "Availability added",
//     });
//   };

//   const handleRemoveTimeSlot = (dateToRemove, slotId) => {
//     setAvailability((prev) => {
//       const updatedAvailability = prev.map((day) => {
//         if (format(day.date, 'yyyy-MM-dd') === format(dateToRemove, 'yyyy-MM-dd')) {
//           return {
//             ...day,
//             timeSlots: day.timeSlots.filter((slot) => slot.id !== slotId),
//           };
//         }
//         return day;
//       });

//       return updatedAvailability.filter((day) => day.timeSlots.length > 0);
//     });

//     toast({
//       title: "Time slot removed",
//     });
//   };

//   const createWeeklySlots = () => {
//     const today = new Date();
//     const weeklySlots = [];

//     for (let i = 0; i < 7; i++) {
//       const date = addDays(today, i);
//       weeklySlots.push({
//         date,
//         timeSlots: [
//           { id: `weekly-${i}-1`, startTime: '10:00', endTime: '11:00' },
//           { id: `weekly-${i}-2`, startTime: '14:00', endTime: '15:00' },
//         ],
//       });
//     }

//     setAvailability(weeklySlots);
//     toast({
//       title: "Weekly schedule created",
//       description: "Added 2 slots for each day this week",
//     });
//   };

//   const handleDateSelect = (date) => {
//     if (date instanceof Date) {
//       setSelectedDate(date);
//       setActiveTab("slots"); // Switch to slots tab after selecting a date
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md"
//     >
//       <div className="text-center">
//         <h1 className="text-3xl font-semibold text-gray-900 mb-3">Manage Your Availability</h1>
//         <p className="text-gray-600 mb-6">Set and adjust your teaching schedule (Indian Standard Time - IST).</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a Date</h3>
//             <p className="text-sm text-gray-500 mb-4">Choose a date to view or modify your availability.</p>
//             <div className="rounded-md shadow-sm">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={handleDateSelect}
//                 className="w-full rounded-md border border-gray-300"
//                 classNames={{
//                   day: 'py-2 px-3 rounded-md focus:outline-none',
//                   day_selected: 'bg-orange-500 text-white font-bold focus:outline-none', // Bold selected day
//                   day_today: 'font-semibold text-orange-700', // Highlight today
//                   day_disabled: 'text-gray-400 cursor-not-allowed',
//                   month: 'pt-2',
//                   year: 'pt-2',
//                   caption: 'flex justify-center pt-2 pb-4 text-lg font-semibold text-gray-800',
//                   nav: 'flex justify-between items-center p-2',
//                   nav_button: 'rounded-md hover:bg-gray-100 focus:outline-none p-1 transition-colors',
//                   nav_button_previous: 'mr-2',
//                   nav_button_next: 'ml-2',
//                   table: 'w-full border-collapse',
//                   head_row: 'text-left',
//                   head_cell: 'px-2 py-1 font-normal text-gray-600',
//                   row: '',
//                   cell: 'p-1 relative',
//                 }}
//                 modifiers={{
//                   booked: (date) => hasAvailability(date),
//                 }}
//                 modifiersStyles={{
//                   booked: { backgroundColor: 'rgba(251, 146, 60, 0.3)', fontWeight: 'bold', color: 'orange-800' } // More prominent booked days
//                 }}
//                 disabled={(date) => date < new Date() && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')}
//               />
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={createWeeklySlots}
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
//               >
//                 Set Availability for the Week
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               {selectedDate ? format(selectedDate, 'MMMM d') : 'Manage Time Slots'}
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Add, remove, or view time slots for the selected date (IST).
//             </p>

//             <div className="border-b border-gray-200 mb-4">
//               <div className="flex">
//                 <button
//                   onClick={() => setActiveTab("slots")}
//                   className={`py-2 px-4 rounded-t-md ${activeTab === "slots" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none`} // More emphasis on active tab
//                 >
//                   Available Slots
//                 </button>
//                 <button
//                   onClick={() => selectedDate && setActiveTab("add")}
//                   className={`py-2 px-4 rounded-t-md ${activeTab === "add" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`} // More emphasis on active tab
//                   disabled={!selectedDate}
//                 >
//                   Add New Slot
//                 </button>
//               </div>
//             </div>

//             {activeTab === "slots" && (
//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-800 mb-3">
//                   {hasAvailability(selectedDate) ? 'Available Time Slots (IST)' : 'No availability set for this date'}
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
//                   {getAvailabilityForDate(selectedDate)?.timeSlots.map((slot) => (
//                     <div
//                       key={slot.id}
//                       className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
//                     >
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 mr-2 text-gray-500" />
//                         <span className="font-semibold">{slot.startTime} - {slot.endTime}</span> {/* Bold time slots */}
//                       </div>
//                       <button
//                         onClick={() => handleRemoveTimeSlot(selectedDate, slot.id)}
//                         className="text-gray-500 hover:text-red-600 focus:outline-none" // Slightly darker red on hover
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 {!hasAvailability(selectedDate) && (
//                   <div className="py-6 flex justify-center">
//   <button
//     onClick={() => selectedDate && setActiveTab("add")}
//     className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center"
//     disabled={!selectedDate}
//   >
//     <Plus className="h-4 w-4 mr-2" />
//     <span>Add Time Slots</span>
//   </button>
// </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "add" && selectedDate && (
//               <div className="mt-4 space-y-4">
//                 <h4 className="text-sm font-medium text-gray-800">Add New Time Slot for {format(selectedDate, 'MMMM d')} (IST)</h4>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1"><span className="font-semibold">Start Time (IST)</span></label> {/* Bold label */}
//                     <select
//                       id="start-time"
//                       value={newStartTime}
//                       onChange={(e) => setNewStartTime(e.target.value)}
//                       className="w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 font-semibold" // Bold select text
//                     >
//                       <option value="">Select start time</option>
//                       {timeOptionsIST.map((time) => (
//                         <option key={`start-${time}`} value={time} className="font-semibold">{time}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">
//                       <span className="font-semibold">End Time (IST)</span>
//                     </label> 
//                     <select
//                       id="end-time"
//                       value={newEndTime}
//                       onChange={(e) => setNewEndTime(e.target.value)}
//                       className="w-full py-2.5 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-800 font-semibold" // Bold select text
//                     >
//                       <option value="">Select end time</option>
//                       {timeOptionsIST.map((time) => (
//                         <option key={`end-${time}`} value={time} className="font-semibold">{time}</option> 
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleAddTimeSlot}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 mt-4 shadow-sm" // Already bold
//                 >
//                   <Plus className="h-4 w-4 mr-2" />
//                   Add Time Slot
//                 </button>
//               </div>
//             )}

//             {activeTab === "add" && !selectedDate && (
//               <div className="mt-4 text-gray-500 italic">
//                 Please select a date from the calendar to add new time slots (IST).
//               </div>
//             )}

//             <div className="mt-6">
//               <h4 className="text-sm font-medium text-gray-800 mb-3">Upcoming Availability (IST)</h4>
//               <div className="flex flex-wrap gap-2">
//                 {availability
//                   .filter((day) => day.date >= new Date())
//                   .sort((a, b) => a.date.getTime() - b.date.getTime())
//                   .slice(0, 5)
//                   .map((day, index) => (
//                     <button
//                       key={index}
//                       onClick={() => { setSelectedDate(day.date); setActiveTab("slots"); }}
//                       className={`inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none shadow-sm`}
//                     >
//                       <span className="font-semibold">{format(day.date, 'MMM d')}</span> ({day.timeSlots.length} slots)
//                     </button>
//                   ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherAvailability;








// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { format, addDays, startOfDay, parseISO } from "date-fns";
// import { Clock, Plus, X } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import { Calendar } from "@/components/ui/calendar";
// import { useAuth } from "@/contexts/AuthContext";

// const timeSlots = [
//   "00:00-01:00", "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00",
//   "05:00-06:00", "06:00-07:00", "07:00-08:00", "08:00-09:00", "09:00-10:00",
//   "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00",
//   "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00",
//   "20:00-21:00", "21:00-22:00", "22:00-23:00", "23:00-00:00",
// ];

// const TeacherAvailability = () => {
//   const { api, updateAvailability } = useAuth();
//   const [availability, setAvailability] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
//   const [selectedSlots, setSelectedSlots] = useState([]);
//   const [activeTab, setActiveTab] = useState("slots");
//   const [loading, setLoading] = useState(true);

//   // Fetch initial availability from /auth/profile with retry
//   useEffect(() => {
//     const fetchAvailability = async (retryCount = 0, maxRetries = 3) => {
//       try {
//         const { data } = await api.get("/auth/profile");
//         console.log("Raw /auth/profile response:", JSON.stringify(data, null, 2));
//         if (data && data.availability && Array.isArray(data.availability)) {
//           const mappedAvailability = data.availability.map((day, index) => {
//             if (!day.date) {
//               console.warn(`Missing date in availability at index ${index}:`, day);
//               return null;
//             }
//             let parsedDate;
//             try {
//               parsedDate = parseISO(day.date);
//               if (isNaN(parsedDate.getTime())) {
//                 console.warn(`Invalid date format at index ${index}:`, day.date);
//                 return null;
//               }
//             } catch (err) {
//               console.warn(`Failed to parse date at index ${index}:`, day.date, err);
//               return null;
//             }
//             const slots = Array.isArray(day.slots) ? day.slots : [];
//             return {
//               date: startOfDay(parsedDate),
//               timeSlots: slots
//                 .filter(slot => slot && slot.startTime && slot.endTime)
//                 .map(slot => ({
//                   id: slot.id || `slot-${parsedDate.getTime()}-${slot.startTime}-${Math.random()}`,
//                   startTime: slot.startTime,
//                   endTime: slot.endTime,
//                 })),
//             };
//           }).filter(day => day !== null);
//           console.log("Mapped availability (IST):", JSON.stringify(mappedAvailability, null, 2));
//           setAvailability(mappedAvailability);
//           if (mappedAvailability.length === 0 && data.availability.length > 0) {
//             toast({
//               title: "No valid availability data",
//               description: "Availability data was returned but filtered out due to invalid format.",
//               variant: "destructive",
//             });
//           }
//         } else {
//           console.warn("No valid availability data in response:", data);
//           setAvailability([]);
//           toast({
//             title: "No availability data found",
//             description: "No availability data returned from the server.",
//             variant: "destructive",
//           });
//         }
//       } catch (err) {
//         console.error("Fetch error:", err);
//         if (retryCount < maxRetries) {
//           console.log(`Retrying fetch (${retryCount + 1}/${maxRetries})...`);
//           setTimeout(() => fetchAvailability(retryCount + 1, maxRetries), 1000);
//         } else {
//           toast({
//             title: "Failed to fetch availability",
//             description: err.response?.data?.message || "Please try again later.",
//             variant: "destructive",
//           });
//           setAvailability([]);
//         }
//       } finally {
//         if (retryCount === 0 || retryCount === maxRetries) {
//           setLoading(false);
//         }
//       }
//     };
//     fetchAvailability();
//   }, [api]);

//   const getAvailabilityForDate = (date) => {
//     if (!date || isNaN(date.getTime())) {
//       console.warn("Invalid date passed to getAvailabilityForDate:", date);
//       return null;
//     }
//     return availability.find(
//       (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
//     );
//   };

//   const hasAvailability = (date) => {
//     if (!date || isNaN(date.getTime())) {
//       console.warn("Invalid date passed to hasAvailability:", date);
//       return false;
//     }
//     return availability.some(
//       (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
//     );
//   };

//   const handleSlotToggle = (slot) => {
//     console.log("Toggling slot:", slot);
//     if (selectedSlots.includes(slot)) {
//       setSelectedSlots(selectedSlots.filter(s => s !== slot));
//     } else {
//       setSelectedSlots([...selectedSlots, slot]);
//     }
//   };

//   const handleAddTimeSlots = async () => {
//     if (!selectedDate || isNaN(selectedDate.getTime())) {
//       console.error("Invalid selectedDate:", selectedDate);
//       toast({
//         title: "Please select a valid date",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (selectedSlots.length === 0) {
//       toast({
//         title: "Please select at least one time slot",
//         variant: "destructive",
//       });
//       return;
//     }

//     const newSlots = selectedSlots.map(slot => {
//       const [startTime, endTime] = slot.split('-');
//       return {
//         id: `slot-${Date.now()}-${Math.random()}`,
//         startTime,
//         endTime,
//       };
//     });

//     let updatedAvailability = [...availability];
//     const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
//     const existingDayIndex = availability.findIndex(
//       (a) => format(a.date, 'yyyy-MM-dd') === formattedSelectedDate
//     );

//     if (existingDayIndex !== -1) {
//       const existingSlots = updatedAvailability[existingDayIndex].timeSlots;
//       const filteredNewSlots = newSlots.filter(
//         newSlot => !existingSlots.some(
//           slot => slot.startTime === newSlot.startTime && slot.endTime === newSlot.endTime
//         )
//       );
//       if (filteredNewSlots.length === 0) {
//         toast({
//           title: "No new slots to add",
//           description: "All selected slots already exist for this date.",
//           variant: "destructive",
//         });
//         return;
//       }
//       updatedAvailability[existingDayIndex] = {
//         ...updatedAvailability[existingDayIndex],
//         timeSlots: [...existingSlots, ...filteredNewSlots],
//       };
//     } else {
//       updatedAvailability.push({
//         date: startOfDay(selectedDate),
//         timeSlots: newSlots,
//       });
//     }

//     const backendAvailability = updatedAvailability.map(day => ({
//       date: format(day.date, 'yyyy-MM-dd'),
//       slots: day.timeSlots.map(slot => ({
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//       })),
//     }));

//     console.log("Selected date (IST):", formattedSelectedDate);
//     console.log("Sending add time slots payload:", JSON.stringify(backendAvailability, null, 2));

//     try {
//       const response = await updateAvailability(backendAvailability);
//       console.log("Add time slots response:", response.data);
//       setAvailability(updatedAvailability);
//       setSelectedSlots([]);
//       setActiveTab("slots");
//       toast({
//         title: "Availability added successfully",
//         description: `${filteredNewSlots?.length || newSlots.length} slot(s) added for ${formattedSelectedDate}.`,
//       });
//     } catch (err) {
//       console.error("Add time slots error:", err);
//       toast({
//         title: "Failed to add availability",
//         description: err.response?.data?.message || "Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleRemoveTimeSlot = (dateToRemove, slotId) => {
//     console.log("handleRemoveTimeSlot triggered with date:", format(dateToRemove, 'yyyy-MM-dd'), "slotId:", slotId);
//     if (!dateToRemove || isNaN(dateToRemove.getTime())) {
//       console.error("Invalid dateToRemove:", dateToRemove);
//       toast({
//         title: "Invalid date",
//         description: "Cannot remove slot due to invalid date.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const dayAvailability = getAvailabilityForDate(dateToRemove);
//     if (!dayAvailability) {
//       console.error("No availability found for date:", format(dateToRemove, 'yyyy-MM-dd'));
//       toast({
//         title: "No availability",
//         description: "No slots found for the selected date.",
//         variant: "destructive",
//       });
//       return;
//     }

//     const slotToRemove = dayAvailability.timeSlots.find(slot => slot.id === slotId);
//     if (!slotToRemove) {
//       console.error("Slot not found for ID:", slotId);
//       toast({
//         title: "Slot not found",
//         description: "The slot you are trying to remove does not exist.",
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Confirm Deletion",
//       description: `Are you sure you want to remove the slot ${slotToRemove.startTime} - ${slotToRemove.endTime} for ${format(dateToRemove, 'MMMM d')}?`,
//       action: (
//         <button
//           onClick={async () => {
//             console.log("Confirm deletion clicked for slot:", slotId);
//             let updatedAvailability = availability.map(day => {
//               if (format(day.date, 'yyyy-MM-dd') === format(dateToRemove, 'yyyy-MM-dd')) {
//                 return {
//                   ...day,
//                   timeSlots: day.timeSlots.filter(slot => slot.id !== slotId),
//                 };
//               }
//               return day;
//             }).filter(day => day.timeSlots.length > 0);

//             const backendAvailability = updatedAvailability.map(day => ({
//               date: format(day.date, 'yyyy-MM-dd'),
//               slots: day.timeSlots.map(slot => ({
//                 startTime: slot.startTime,
//                 endTime: slot.endTime,
//               })),
//             }));

//             console.log("Sending remove time slot payload:", JSON.stringify(backendAvailability, null, 2));

//             try {
//               const response = await updateAvailability(backendAvailability);
//               console.log("Remove time slot response:", response.data);
//               setAvailability(updatedAvailability);
//               toast({
//                 title: "Time slot removed successfully",
//               });
//             } catch (err) {
//               console.error("Remove time slot error:", err);
//               toast({
//                 title: "Failed to remove time slot",
//                 description: err.response?.data?.message || "Please try again.",
//                 variant: "destructive",
//               });
//             }
//           }}
//           className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md"
//         >
//           Confirm
//         </button>
//       ),
//     });
//   };

//   const createWeeklySlots = async () => {
//     const confirm = window.confirm(
//       "Add default slots (10:00-11:00, 14:00-15:00 IST) for the next 7 days (July 18–24, 2025)? Existing slots will be preserved."
//     );
//     if (!confirm) {
//       toast({
//         title: "Action cancelled",
//         description: "Weekly schedule update was not applied.",
//       });
//       return;
//     }

//     const today = startOfDay(new Date());
//     const newWeeklySlots = [];
//     const updatedDates = [];
//     const skippedDates = [];

//     for (let i = 0; i < 7; i++) {
//       const date = addDays(today, i);
//       const formattedDate = format(date, 'yyyy-MM-dd');
//       const existingDay = availability.find(
//         a => format(a.date, 'yyyy-MM-dd') === formattedDate
//       );

//       const newSlots = [
//         { id: `weekly-${i}-1`, startTime: '10:00', endTime: '11:00' },
//         { id: `weekly-${i}-2`, startTime: '14:00', endTime: '15:00' },
//       ];

//       const existingSlots = existingDay ? existingDay.timeSlots : [];
//       const slotsToAdd = newSlots.filter(newSlot => 
//         !existingSlots.some(existingSlot => 
//           existingSlot.startTime === newSlot.startTime && existingSlot.endTime === newSlot.endTime
//         )
//       );

//       if (slotsToAdd.length > 0) {
//         newWeeklySlots.push({
//           date: startOfDay(date),
//           timeSlots: existingDay ? [...existingDay.timeSlots, ...slotsToAdd] : slotsToAdd,
//         });
//         updatedDates.push(formattedDate);
//       } else {
//         skippedDates.push(formattedDate);
//       }
//     }

//     const otherDays = availability.filter(
//       day => !newWeeklySlots.some(
//         newDay => format(newDay.date, 'yyyy-MM-dd') === format(day.date, 'yyyy-MM-dd')
//       )
//     );

//     const updatedAvailability = [...otherDays, ...newWeeklySlots].sort(
//       (a, b) => a.date.getTime() - b.date.getTime()
//     );

//     const backendAvailability = updatedAvailability.map(day => ({
//       date: format(day.date, 'yyyy-MM-dd'),
//       slots: day.timeSlots.map(slot => ({
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//       })),
//     }));

//     console.log("Updated dates (IST):", updatedDates);
//     console.log("Skipped dates (IST):", skippedDates);
//     console.log("Sending weekly slots payload:", JSON.stringify(backendAvailability, null, 2));

//     try {
//       const response = await updateAvailability(backendAvailability);
//       console.log("Weekly slots response:", response.data);
//       setAvailability(updatedAvailability);
//       setSelectedDate(newWeeklySlots[0]?.date || today);
//       setActiveTab("slots");
//       const toastMessage = updatedDates.length > 0 
//         ? `Added slots for ${updatedDates.length} day(s): ${updatedDates.join(", ")}` + 
//           (skippedDates.length > 0 ? `. Skipped ${skippedDates.length} day(s) with existing slots: ${skippedDates.join(", ")}` : "")
//         : `No new slots added; all days have existing slots: ${skippedDates.join(", ")}`;
//       toast({
//         title: "Weekly schedule updated",
//         description: toastMessage,
//       });
//     } catch (err) {
//       console.error("Weekly slots error:", err);
//       toast({
//         title: "Failed to update weekly schedule",
//         description: err.response?.data?.message || "Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDateSelect = (date) => {
//     console.log("Date selected:", date);
//     if (date instanceof Date && !isNaN(date.getTime())) {
//       setSelectedDate(startOfDay(date));
//       setActiveTab("slots");
//       setSelectedSlots([]);
//     } else {
//       console.warn("Invalid date selected:", date);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md">
//         <style>
//           {`
//             .skeleton {
//               animation: pulse 1.5s ease-in-out infinite;
//               background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
//               background-size: 200% 100%;
//             }
//             @keyframes pulse {
//               0% { background-position: 200% 0; }
//               100% { background-position: -200% 0; }
//             }
//             @media (forced-colors: active) {
//               .skeleton {
//                 forced-color-adjust: none;
//                 background: Canvas;
//                 animation: none;
//                 border: 1px solid ButtonBorder;
//               }
//             }
//           `}
//         </style>
//         <div className="text-center">
//           <div className="h-8 w-3/4 mx-auto skeleton rounded-md" />
//           <div className="h-4 w-1/2 mx-auto skeleton rounded-md mt-3" />
//         </div>
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
//             <div className="p-6 space-y-4">
//               <div className="h-6 w-1/3 skeleton rounded-md" />
//               <div className="h-4 w-2/3 skeleton rounded-md" />
//               <div className="grid grid-cols-7 gap-1">
//                 {[...Array(35)].map((_, i) => (
//                   <div key={i} className="h-10 w-full skeleton rounded-md" />
//                 ))}
//               </div>
//               <div className="h-12 w-full skeleton rounded-md" />
//             </div>
//           </div>
//           <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
//             <div className="p-6 space-y-4">
//               <div className="h-6 w-1/3 skeleton rounded-md" />
//               <div className="h-4 w-2/3 skeleton rounded-md" />
//               <div className="flex gap-2">
//                 <div className="h-8 w-24 skeleton rounded-md" />
//                 <div className="h-8 w-24 skeleton rounded-md" />
//               </div>
//               <div className="space-y-2">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={i} className="h-12 w-full skeleton rounded-md" />
//                 ))}
//               </div>
//               <div className="h-6 w-1/3 skeleton rounded-md" />
//               <div className="flex flex-wrap gap-2">
//                 {[...Array(5)].map((_, i) => (
//                   <div key={i} className="h-8 w-24 skeleton rounded-full" />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md"
//     >
//       <style>
//         {`
//           @media (forced-colors: active) {
//             .bg-orange-500 {
//               forced-color-adjust: none;
//               background-color: ButtonFace;
//               color: ButtonText;
//               border: 2px solid ButtonText;
//             }
//             .bg-orange-500:hover {
//               background-color: Highlight;
//               color: HighlightText;
//             }
//             .text-orange-600 {
//               forced-color-adjust: none;
//               color: ButtonText;
//             }
//             .bg-gray-100 {
//               forced-color-adjust: none;
//               background-color: ButtonFace;
//             }
//             .border-orange-600 {
//               forced-color-adjust: none;
//               border-color: ButtonText;
//             }
//             .text-gray-700 {
//               forced-color-adjust: none;
//               color: ButtonText;
//             }
//             .text-gray-600 {
//               forced-color-adjust: none;
//               color: ButtonText;
//             }
//             .bg-gray-50 {
//               forced-color-adjust: none;
//               background-color: Canvas;
//             }
//             .border-gray-300 {
//               forced-color-adjust: none;
//               border-color: ButtonBorder;
//             }
//             .text-gray-500 {
//               forced-color-adjust: none;
//               color: GrayText;
//             }
//             .hover\\:text-red-600:hover {
//               forced-color-adjust: none;
//               color: Highlight;
//             }
//             .focus\\:ring-orange-400 {
//               outline: 2px solid Highlight;
//             }
//             .day_selected {
//               forced-color-adjust: none;
//               background-color: Highlight;
//               color: HighlightText;
//             }
//             .day_today {
//               forced-color-adjust: none;
//               color: ButtonText;
//               font-weight: bold;
//             }
//             .day_disabled {
//               forced-color-adjust: none;
//               color: GrayText;
//             }
//             .booked {
//               forced-color-adjust: none;
//               background-color: ButtonFace;
//               border: 1px solid ButtonText;
//               color: ButtonText;
//             }
//             .upcoming-availability {
//               max-height: 150px;
//               overflow-y: auto;
//               padding-right: 8px;
//             }
//             .slot-selected {
//               background-color: #fb923c;
//               color: white;
//             }
//           }
//         `}
//       </style>
//       <div className="text-center">
//         <h1 className="text-3xl font-semibold text-gray-900 mb-3">Manage Your Availability</h1>
//         <p className="text-gray-600 mb-6">Set and adjust your teaching schedule (Indian Standard Time - IST).</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Select a Date</h3>
//             <p className="text-sm text-gray-500 mb-4">Choose a date to view or modify your availability.</p>
//             <div className="rounded-md shadow-sm">
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={handleDateSelect}
//                 className="w-full rounded-md border border-gray-300"
//                 classNames={{
//                   day: 'py-2 px-3 rounded-md focus:outline-none',
//                   day_selected: 'bg-orange-500 text-white font-bold focus:outline-none',
//                   day_today: 'font-semibold text-orange-700',
//                   day_disabled: 'text-gray-400 cursor-not-allowed',
//                   month: 'pt-2',
//                   year: 'pt-2',
//                   caption: 'flex justify-center pt-2 pb-4 text-lg font-semibold text-gray-800',
//                   nav: 'flex justify-between items-center p-2',
//                   nav_button: 'rounded-md hover:bg-gray-100 focus:outline-none p-1 transition-colors',
//                   nav_button_previous: 'mr-2',
//                   nav_button_next: 'ml-2',
//                   table: 'w-full border-collapse',
//                   head_row: 'text-left',
//                   head_cell: 'px-2 py-1 font-normal text-gray-600',
//                   row: '',
//                   cell: 'p-1 relative',
//                 }}
//                 modifiers={{
//                   booked: (date) => hasAvailability(date),
//                 }}
//                 modifiersStyles={{
//                   booked: { backgroundColor: 'rgba(251, 146, 60, 0.3)', fontWeight: 'bold', color: 'orange-800' }
//                 }}
//                 disabled={(date) => date < new Date() && format(date, 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')}
//               />
//             </div>

//             <div className="mt-6">
//               <button
//                 onClick={createWeeklySlots}
//                 className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
//               >
//                 Set Availability for the Week
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">
//               {selectedDate ? format(selectedDate, 'MMMM d') : 'Manage Time Slots'}
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Add, remove, or view time slots for the selected date (IST).
//             </p>

//             <div className="border-b border-gray-200 mb-4">
//               <div className="flex">
//                 <button
//                   onClick={() => setActiveTab("slots")}
//                   className={`py-2 px-4 rounded-t-md ${activeTab === "slots" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none`}
//                 >
//                   Available Slots
//                 </button>
//                 <button
//                   onClick={() => selectedDate && setActiveTab("add")}
//                   className={`py-2 px-4 rounded-t-md ${activeTab === "add" ? 'bg-gray-100 text-orange-600 font-bold border-b-2 border-orange-600' : 'text-gray-700 hover:text-orange-600'} focus:outline-none ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
//                   disabled={!selectedDate}
//                 >
//                   Add New Slots
//                 </button>
//               </div>
//             </div>

//             {activeTab === "slots" && (
//               <div className="mt-4">
//                 <h4 className="text-sm font-medium text-gray-800 mb-3">
//                   {hasAvailability(selectedDate) ? 'Available Time Slots (IST)' : 'No availability set for this date'}
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
//                   {getAvailabilityForDate(selectedDate)?.timeSlots.map((slot) => (
//                     <div
//                       key={slot.id}
//                       className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm"
//                     >
//                       <div className="flex items-center">
//                         <Clock className="h-4 w-4 mr-2 text-gray-500" />
//                         <span className="font-semibold">{slot.startTime} - {slot.endTime}</span>
//                       </div>
//                       <button
//                         onClick={() => handleRemoveTimeSlot(selectedDate, slot.id)}
//                         className="text-gray-500 hover:text-red-600 focus:outline-none"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 {!hasAvailability(selectedDate) && (
//                   <div className="py-6 flex justify-center">
//                     <button
//                       onClick={() => selectedDate && setActiveTab("add")}
//                       className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center"
//                       disabled={!selectedDate}
//                     >
//                       <Plus className="h-4 w-4 mr-2" />
//                       <span>Add Time Slots</span>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {activeTab === "add" && selectedDate && (
//               <div className="mt-4 space-y-4">
//                 <h4 className="text-sm font-medium text-gray-800">Add Time Slots for {format(selectedDate, 'MMMM d')} (IST)</h4>
//                 <p className="text-sm text-gray-500">Select one or more time slots to add.</p>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                   {timeSlots.map((slot) => (
//                     <button
//                       key={slot}
//                       onClick={() => handleSlotToggle(slot)}
//                       className={`py-2 px-3 rounded-md border border-gray-300 text-sm font-semibold ${
//                         selectedSlots.includes(slot) ? 'slot-selected' : 'bg-white hover:bg-gray-100'
//                       }`}
//                     >
//                       {slot}
//                     </button>
//                   ))}
//                 </div>
//                 <button
//                   onClick={handleAddTimeSlots}
//                   className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 mt-4 shadow-sm"
//                   disabled={selectedSlots.length === 0}
//                 >
//                   <Plus className="h-4 w-4 mr-2 inline" />
//                   Add {selectedSlots.length} Slot{selectedSlots.length !== 1 ? 's' : ''}
//                 </button>
//               </div>
//             )}

//             {activeTab === "add" && !selectedDate && (
//               <div className="mt-4 text-gray-500 italic">
//                 Please select a date from the calendar to add new time slots (IST).
//               </div>
//             )}

//             <div className="mt-6">
//               <h4 className="text-sm font-medium text-gray-800 mb-3">Upcoming Availability (IST)</h4>
//               {availability.length === 0 ? (
//                 <p className="text-sm text-gray-500">No upcoming availability set.</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2 upcoming-availability">
//                   {availability
//                     .filter((day) => day.date >= new Date())
//                     .sort((a, b) => a.date.getTime() - b.date.getTime())
//                     .map((day, index) => (
//                       <button
//                         key={index}
//                         onClick={() => { setSelectedDate(day.date); setActiveTab("slots"); }}
//                         className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-300 focus:outline-none shadow-sm"
//                       >
//                         <span className="font-semibold">{format(day.date, 'MMM d')}</span> ({day.timeSlots.length} slots)
//                       </button>
//                     ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default TeacherAvailability;








import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfDay, parseISO } from "date-fns";
import { Clock, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
        } else {
          setAvailability([]);
          toast({
            title: "No availability data found",
            description: "No valid data returned from the server.",
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Failed to fetch availability",
          description: err.response?.data?.message || "Please try again later.",
          variant: "destructive",
        });
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
      toast({
        title: "Error",
        description: !selectedDate
          ? "Please select a valid date"
          : "Please select at least one time slot",
        variant: "destructive",
      });
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
      updatedAvailability[dayIndex].timeSlots = [
        ...updatedAvailability[dayIndex].timeSlots,
        ...newSlots.filter(
          (ns) =>
            !updatedAvailability[dayIndex].timeSlots.some(
              (es) => es.startTime === ns.startTime && es.endTime === ns.endTime
            )
        ),
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
      toast({
        title: "Availability added successfully",
        description: `${newSlots.length} slot(s) added for ${format(selectedDate, "MMMM d")}.`,
      });
    } catch (err) {
      toast({
        title: "Failed to add availability",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveTimeSlot = (dateToRemove, slotId) => {
    const dayAvailability = getAvailabilityForDate(dateToRemove);
    if (!dayAvailability) return;

    const slotToRemove = dayAvailability.timeSlots.find((slot) => slot.id === slotId);
    if (!slotToRemove) return;

    toast({
      title: "Confirm Deletion",
      description: `Remove slot ${slotToRemove.startTime} - ${slotToRemove.endTime} for ${format(
        dateToRemove,
        "MMMM d"
      )}?`,
      action: (
        <button
          onClick={async () => {
            const updatedAvailability = availability
              .map((day) =>
                format(day.date, "yyyy-MM-dd") === format(dateToRemove, "yyyy-MM-dd")
                  ? { ...day, timeSlots: day.timeSlots.filter((slot) => slot.id !== slotId) }
                  : day
              )
              .filter((day) => day.timeSlots.length > 0);

            const backendAvailability = updatedAvailability.map((day) => ({
              date: format(day.date, "yyyy-MM-dd"),
              slots: day.timeSlots.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
              })),
            }));

            try {
              await updateAvailability(backendAvailability);
              setAvailability(updatedAvailability);
              toast({ title: "Time slot removed successfully" });
            } catch (err) {
              toast({
                title: "Failed to remove time slot",
                description: err.response?.data?.message || "Please try again.",
                variant: "destructive",
              });
            }
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Confirm
        </button>
      ),
    });
  };

  const createWeeklySlots = async () => {
    const today = startOfDay(new Date());
    const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    const startDate = format(nextSevenDays[0], "MMMM d");
    const endDate = format(nextSevenDays[6], "MMMM d, yyyy");

    const confirm = window.confirm(
      `Add default slots (10:00-11:00, 14:00-15:00 IST) for ${startDate}–${endDate}? Existing slots will be preserved.`
    );
    if (!confirm) return;

    const newWeeklySlots = nextSevenDays
      .map((date) => {
        const existingDay = getAvailabilityForDate(date);
        const newSlots = [
          { id: `weekly-${format(date, "yyyy-MM-dd")}-1`, startTime: "10:00", endTime: "11:00" },
          { id: `weekly-${format(date, "yyyy-MM-dd")}-2`, startTime: "14:00", endTime: "15:00" },
        ].filter(
          (ns) =>
            !existingDay?.timeSlots.some(
              (es) => es.startTime === ns.startTime && es.endTime === ns.endTime
            )
        );
        return newSlots.length > 0
          ? { date, timeSlots: existingDay ? [...existingDay.timeSlots, ...newSlots] : newSlots }
          : null;
      })
      .filter((day) => day !== null);

    const updatedAvailability = [
      ...availability.filter(
        (day) => !nextSevenDays.some((d) => format(d, "yyyy-MM-dd") === format(day.date, "yyyy-MM-dd"))
      ),
      ...newWeeklySlots,
    ].sort((a, b) => a.date.getTime() - b.date.getTime());

    const backendAvailability = updatedAvailability.map((day) => ({
      date: format(day.date, "yyyy-MM-dd"),
      slots: day.timeSlots.map((slot) => ({ startTime: slot.startTime, endTime: slot.endTime })),
    }));

    try {
      await updateAvailability(backendAvailability);
      setAvailability(updatedAvailability);
      setSelectedDate(nextSevenDays[0]);
      setActiveTab("slots");
      toast({
        title: "Weekly schedule updated",
        description: `Slots added for ${startDate}–${endDate}.`,
      });
    } catch (err) {
      toast({
        title: "Failed to update weekly schedule",
        description: err.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDateSelect = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(startOfDay(date));
      setActiveTab("slots");
      setSelectedSlots([]);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 bg-gray-50 p-8 rounded-xl shadow-md"
    >
      <style>
        {`
          .slot-selected, .slot-booked {
            background-color: #3b82f6;
            color: white;
          }
        `}
      </style>
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-

900">Manage Your Availability</h1>
        <p className="text-gray-600">Set your teaching schedule (IST).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold">Select a Date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date() && format(date, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")}
          />
          <button
            onClick={createWeeklySlots}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md mt-6"
          >
            Set Availability for the Week
          </button>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold">
            {selectedDate ? format(selectedDate, "MMMM d") : "Manage Time Slots"}
          </h3>
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab("slots")}
              className={`py-2 px-4 ${activeTab === "slots" ? "bg-gray-100 text-orange-600" : ""}`}
            >
              Available Slots
            </button>
            <button
              onClick={() => selectedDate && setActiveTab("add")}
              className={`py-2 px-4 ${activeTab === "add" ? "bg-gray-100 text-orange-600" : ""}`}
              disabled={!selectedDate}
            >
              Add New Slots
            </button>
          </div>

          {activeTab === "slots" && (
            <div>
              <h4>{hasAvailability(selectedDate) ? "Available Time Slots (IST)" : "No availability set"}</h4>
              {getAvailabilityForDate(selectedDate)?.timeSlots.map((slot) => (
                <div key={slot.id} className="flex justify-between p-3 border rounded-md">
                  <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                  <button onClick={() => handleRemoveTimeSlot(selectedDate, slot.id)}>
                    <X />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "add" && selectedDate && (
            <div>
              <h4>Add Time Slots for {format(selectedDate, "MMMM d")} (IST)</h4>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => {
                  const isBooked = getAvailabilityForDate(selectedDate)?.timeSlots.some(
                    (s) => `${s.startTime}-${s.endTime}` === slot
                  );
                  const isSelected = selectedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      onClick={() => !isBooked && handleSlotToggle(slot)}
                      className={`py-2 px-3 rounded-md border ${
                        isBooked ? "slot-booked cursor-not-allowed" : isSelected ? "slot-selected" : "bg-white"
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
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md mt-4"
                disabled={selectedSlots.length === 0}
              >
                Add {selectedSlots.length} Slot{selectedSlots.length !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TeacherAvailability;
