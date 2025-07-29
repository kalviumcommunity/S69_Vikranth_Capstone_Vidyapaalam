
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";
// import { Calendar as CalendarIcon, Clock, ArrowRight, CreditCard } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { useAuth } from "../../contexts/AuthContext";
// import { useSession } from "../../contexts/SessionContext";

// const steps = [
//   { value: "date", label: "Select Date & Time" },
//   { value: "payment", label: "Review & Pay" },
// ];

// const BookSession = () => {
//   const { teacherId } = useParams();
//   const navigate = useNavigate();
//   const { api, user } = useAuth();
//   const { handlePaymentSuccess, error } = useSession();
//   const [step, setStep] = useState("date");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [teacher, setTeacher] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeacherData = async () => {
//       setIsLoading(true);
//       try {
//         if (!api) throw new Error("API instance is undefined");
//         const response = await api.get(`/api/teacher-profiles/${teacherId}`);
//         setTeacher(response.data);

//         const parsedAvailability = response.data.availability.map(item => {
//           const [dateStr, ...slotsStr] = item.split(" ");
//           const date = new Date(dateStr);
//           const slots = slotsStr.join(" ").split(", ").map(slot => {
//             const [startTime, endTime] = slot.split("-");
//             return { startTime, endTime, available: true };
//           });
//           return { date, slots };
//         });
//         setAvailableSlots(parsedAvailability);
//         console.log("Parsed availableSlots:", parsedAvailability);
//       } catch (error) {
//         console.error("Error fetching teacher data:", error);
//         alert("Failed to load teacher data or availability");
//         setTeacher(null);
//         setAvailableSlots([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTeacherData();
//   }, [api, teacherId]);

//   useEffect(() => {
//     if (step === "date") {
//       if (selectedDate && selectedSlot) setProgress(50);
//       else if (selectedDate || selectedSlot) setProgress(25);
//       else setProgress(0);
//     } else if (step === "payment") {
//       setProgress(100);
//     }
//   }, [step, selectedDate, selectedSlot]);

//   const handleNext = () => {
//     if (step === "date") {
//       if (!selectedDate) {
//         alert("Please select a date");
//         return;
//       }
//       if (!selectedSlot) {
//         alert("Please select a time slot");
//         return;
//       }
//       setStep("payment");
//     } else if (step === "payment") {
//       handlePayment();
//     }
//   };

//   const handlePrev = () => {
//     if (step === "payment") {
//       setStep("date");
//       setProgress(50);
//     }
//   };

//   const handlePayment = () => {
//     if (!teacher || !selectedDate || !selectedSlot) {
//       alert("Please complete all details before payment.");
//       return;
//     }

//     const teacherData = {
//       name: teacher.name,
//       skill: teacher.teachingSkills?.[0] || "Unknown",
//       dateTime: selectedDate.toISOString(),
//       startTime: selectedSlot.startTime,
//       endTime: selectedSlot.endTime,
//     };
//     handlePaymentSuccess(teacherData);
//   };

//   const handleSelectDate = (date) => {
//     setSelectedDate(date instanceof Date ? date : null);
//     setSelectedSlot(null);
//     setProgress(date ? 25 : 0);
//   };

//   const handleSelectSlot = (slot) => {
//     setSelectedSlot(slot);
//     setProgress(selectedDate ? 50 : 25);
//   };

//   const getAvailableSlotsForDate = () => {
//     if (!selectedDate) return [];
//     const dateStr = selectedDate.toISOString().split("T")[0];
//     return availableSlots
//       .filter(item => item.date.toISOString().split("T")[0] === dateStr)
//       .flatMap(item => item.slots.map((slot, index) => ({
//         id: `${dateStr}-${slot.startTime}-${slot.endTime}-${index}`,
//         time: `${slot.startTime} - ${slot.endTime}`,
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         available: slot.available,
//       })));
//   };

//   const isDateDisabled = (date) => {
//     if (date < new Date()) return true;
//     const dateStr = date.toISOString().split("T")[0];
//     return !availableSlots.some(item => item.date.toISOString().split("T")[0] === dateStr);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-8 max-w-3xl mx-auto p-6"
//     >
//       <div className="text-center">
//         <h2 className="text-3xl font-bold text-orange-600 mb-2">Book a Session</h2>
//         <p className="text-lg text-gray-600">
//           Schedule your session with <span className="font-semibold">{teacher?.name || "Unknown Teacher"}</span>
//         </p>
//       </div>

//       <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//         <motion.div
//           className="bg-orange-500 h-2.5 rounded-full absolute top-0 left-0"
//           style={{ width: `${progress}%` }}
//           transition={{ duration: 0.5, ease: "easeInOut" }}
//         ></motion.div>
//       </div>

//       <div className="flex justify-between text-sm text-gray-500 mt-2">
//         {steps.map((s, index) => (
//           <span
//             key={s.value}
//             className={
//               index <= steps.findIndex(stepItem => stepItem.value === step)
//                 ? "text-orange-600 font-semibold"
//                 : ""
//             }
//           >
//             {s.label}
//           </span>
//         ))}
//       </div>

//       <Card className="shadow-xl rounded-lg overflow-hidden">
//         <div className={`p-8 ${step !== "date" && "hidden"}`}>
//           <h3 className="text-xl font-semibold text-gray-800 mb-6">1. Select Date & Time</h3>
//           <div className="grid gap-8 md:grid-cols-2">
//             <div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={handleSelectDate}
//                 className="rounded-md border shadow-sm"
//                 disabled={isDateDisabled}
//               />
//             </div>
//             <div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">Available Time Slots</h4>
//               {!selectedDate ? (
//                 <p className="text-gray-500">Please select a date to see available time slots.</p>
//               ) : isLoading ? (
//                 <p className="text-gray-500">Loading slots...</p>
//               ) : getAvailableSlotsForDate().length === 0 ? (
//                 <p className="text-gray-500">No available slots for this date.</p>
//               ) : (
//                 <div className="space-y-3">
//                   {getAvailableSlotsForDate().map((slot) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => handleSelectSlot(slot)}
//                       className={`w-full flex items-center justify-between rounded-md border p-3 transition-colors ${
//                         selectedSlot?.id === slot.id
//                           ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
//                           : "hover:bg-gray-50"
//                       }`}
//                       disabled={!slot.available}
//                     >
//                       <div className="flex items-center">
//                         <Clock className="h-5 w-5 mr-2 text-gray-500" />
//                         <span>{slot.time}</span>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <CardFooter className="flex justify-end mt-8">
//             <button
//               onClick={handleNext}
//               disabled={!selectedDate || !selectedSlot || isLoading}
//               className="inline-flex items-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
//             >
//               Continue <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </CardFooter>
//         </div>

//         <div className={`p-8 ${step !== "payment" && "hidden"}`}>
//           <h3 className="text-xl font-semibold text-gray-800 mb-6">2. Review & Pay</h3>
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold text-gray-800">Booking Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
//                 {teacher?.name?.split(' ').map(n => n[0]).join('') || "??"}
//               </div>
//               <div>
//                 <p className="font-medium text-gray-800">{teacher?.name || "Unknown Teacher"}</p>
//                 <p className="text-sm text-gray-500">{teacher?.teachingSkills?.[0] || "Unknown Skill"} Teacher</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h4 className="font-semibold text-gray-800">Session Details</h4>
//               <div className="flex items-center text-gray-600">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 <span>{selectedDate ? selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' }) : "Not selected"}</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Clock className="h-5 w-5 mr-2" />
//                 <span>{selectedSlot?.time || "Not selected"}</span>
//               </div>
//             </div>

//             <div className="border-t pt-6">
//               <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Session Fee</span>
//                 <span>${teacher?.hourlyRate || 0}.00</span>
//               </div>
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Platform Fee</span>
//                 <span>$2.00</span>
//               </div>
//               <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
//                 <span>Total</span>
//                 <span>${(teacher?.hourlyRate || 0) + 2}.00</span>
//               </div>
//             </div>

//             {error && <p className="text-red-500 text-center">{error}</p>}
//           </CardContent>
//           <CardFooter className="flex justify-end space-x-2">
//             <button
//               onClick={handlePrev}
//               className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleNext}
//               className="inline-flex items-center rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
//             >
//               <CreditCard className="mr-2 h-4 w-4" />
//               Pay Now
//             </button>
//           </CardFooter>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default BookSession;






// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";
// import { Calendar as CalendarIcon, Clock, ArrowRight, CreditCard } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { useAuth } from "../../contexts/AuthContext";
// import { useSession } from "../../contexts/SessionContext";

// const steps = [
//   { value: "date", label: "Select Date & Time" },
//   { value: "payment", label: "Review & Pay" },
// ];

// const BookSession = () => {
//   const { teacherId } = useParams();
//   const navigate = useNavigate();
//   const { api, user } = useAuth();
//   const { handlePaymentSuccess, error } = useSession();
//   const [step, setStep] = useState("date");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [teacher, setTeacher] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchTeacherData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       if (!api) throw new Error("API instance is undefined");
//       const response = await api.get(`/api/teacher-profiles/${teacherId}`);
//       setTeacher(response.data);

//       const parsedAvailability = response.data.availability.map(item => {
//         return {
//           date: new Date(item.date),
//           slots: item.slots.map(slot => ({
//             startTime: slot.startTime,
//             endTime: slot.endTime,
//             available: slot.available
//           }))
//         };
//       });
//       setAvailableSlots(parsedAvailability);
//       console.log("Parsed availableSlots:", parsedAvailability);
//     } catch (error) {
//       console.error("Error fetching teacher data:", error);
//       alert("Failed to load teacher data or availability. Please try again.");
//       setTeacher(null);
//       setAvailableSlots([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [api, teacherId]);

//   useEffect(() => {
//     fetchTeacherData();
//   }, [fetchTeacherData]);

//   useEffect(() => {
//     if (step === "date") {
//       if (selectedDate && selectedSlot) setProgress(50);
//       else if (selectedDate || selectedSlot) setProgress(25);
//       else setProgress(0);
//     } else if (step === "payment") {
//       setProgress(100);
//     }
//   }, [step, selectedDate, selectedSlot]);

//   const handleNext = () => {
//     if (step === "date") {
//       if (!selectedDate) {
//         alert("Please select a date.");
//         return;
//       }
//       if (!selectedSlot) {
//         alert("Please select a time slot.");
//         return;
//       }
//       if (!selectedSlot.available) {
//         alert("The selected time slot is no longer available. Please choose another.");
//         setSelectedSlot(null);
//         return;
//       }
//       setStep("payment");
//     } else if (step === "payment") {
//       handlePayment();
//     }
//   };

//   const handlePrev = () => {
//     if (step === "payment") {
//       setStep("date");
//       setProgress(50);
//     }
//   };

//   const handlePayment = () => {
//     if (!teacher || !selectedDate || !selectedSlot) {
//       alert("Please complete all details before payment.");
//       return;
//     }

//     const teacherData = {
//       name: teacher.name,
//       skill: teacher.teachingSkills?.[0] || "Unknown",
//       dateTime: selectedDate.toISOString(),
//       startTime: selectedSlot.startTime,
//       endTime: selectedSlot.endTime,
//       teacherId: teacherId,
//     };
//     handlePaymentSuccess(teacherData);
//   };

//   const handleSelectDate = (date) => {
//     setSelectedDate(date instanceof Date ? date : null);
//     setSelectedSlot(null);
//     setProgress(date ? 25 : 0);
//   };

//   const handleSelectSlot = (slot) => {
//     if (!slot.available) {
//       alert("This slot is already booked. Please choose another.");
//       return;
//     }
//     setSelectedSlot(slot);
//     setProgress(selectedDate ? 50 : 25);
//   };

//   const getAvailableSlotsForDate = () => {
//     if (!selectedDate) return [];

//     const selectedDateLocalISO = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

//     const foundAvailability = availableSlots.find(item => {
//       const itemDateInLocalTime = new Date(item.date);
//       const itemDateLocalISO = `${itemDateInLocalTime.getFullYear()}-${(itemDateInLocalTime.getMonth() + 1).toString().padStart(2, '0')}-${itemDateInLocalTime.getDate().toString().padStart(2, '0')}`;
//       return itemDateLocalISO === selectedDateLocalISO;
//     });

//     if (!foundAvailability) return [];

//     return foundAvailability.slots.map((slot, index) => ({
//       id: `${selectedDateLocalISO}-${slot.startTime}-${slot.endTime}-${index}`,
//       time: `${slot.startTime} - ${slot.endTime}`,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       available: slot.available,
//     }));
//   };

//   const isDateDisabled = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     if (date < today) return true;

//     const calendarDateLocalISO = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

//     return !availableSlots.some(item => {
//       const itemDateInLocalTime = new Date(item.date);
//       const itemDateLocalISO = `${itemDateInLocalTime.getFullYear()}-${(itemDateInLocalTime.getMonth() + 1).toString().padStart(2, '0')}-${itemDateInLocalTime.getDate().toString().padStart(2, '0')}`;
      
//       return itemDateLocalISO === calendarDateLocalISO && item.slots.some(slot => slot.available);
//     });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-8 max-w-3xl mx-auto p-6"
//     >
//       <div className="text-center">
//         <h2 className="text-3xl font-bold text-orange-600 mb-2">Book a Session</h2>
//         <p className="text-lg text-gray-600">
//           Schedule your session with <span className="font-semibold">{teacher?.name || "Unknown Teacher"}</span>
//         </p>
//       </div>

//       <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//         <motion.div
//           className="bg-orange-500 h-2.5 rounded-full absolute top-0 left-0"
//           style={{ width: `${progress}%` }}
//           transition={{ duration: 0.5, ease: "easeInOut" }}
//         ></motion.div>
//       </div>

//       <div className="flex justify-between text-sm text-gray-500 mt-2">
//         {steps.map((s, index) => (
//           <span
//             key={s.value}
//             className={
//               index <= steps.findIndex(stepItem => stepItem.value === step)
//                 ? "text-orange-600 font-semibold"
//                 : ""
//             }
//           >
//             {s.label}
//           </span>
//         ))}
//       </div>

//       <Card className="shadow-xl rounded-lg overflow-hidden">
//         <div className={`p-8 ${step !== "date" && "hidden"}`}>
//           <h3 className="text-xl font-semibold text-gray-800 mb-6">1. Select Date & Time</h3>
//           <div className="grid gap-8 md:grid-cols-2">
//             <div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={handleSelectDate}
//                 className="rounded-md border shadow-sm"
//                 disabled={isDateDisabled}
//               />
//             </div>
//             <div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">Available Time Slots</h4>
//               {!selectedDate ? (
//                 <p className="text-gray-500">Please select a date to see available time slots.</p>
//               ) : isLoading ? (
//                 <p className="text-gray-500">Loading slots...</p>
//               ) : getAvailableSlotsForDate().length === 0 ? (
//                 <p className="text-gray-500">No available slots for this date.</p>
//               ) : (
//                 <div className="space-y-3">
//                   {getAvailableSlotsForDate().map((slot) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => handleSelectSlot(slot)}
//                       className={`w-full flex items-center justify-between rounded-md border p-3 transition-colors ${
//                         selectedSlot?.id === slot.id
//                           ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
//                           : "hover:bg-gray-50"
//                       }
//                       ${
//                         !slot.available
//                           ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
//                           : ""
//                       }`}
//                       disabled={!slot.available}
//                     >
//                       <div className="flex items-center">
//                         <Clock className="h-5 w-5 mr-2 text-gray-500" />
//                         <span>{slot.time}</span>
//                       </div>
//                       {!slot.available && <span className="text-red-500 text-sm font-semibold">Booked</span>}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <CardFooter className="flex justify-end mt-8">
//             <button
//               onClick={handleNext}
//               disabled={!selectedDate || !selectedSlot || isLoading || !selectedSlot?.available}
//               className="inline-flex items-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
//             >
//               Continue <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </CardFooter>
//         </div>

//         <div className={`p-8 ${step !== "payment" && "hidden"}`}>
//           <h3 className="text-xl font-semibold text-gray-800 mb-6">2. Review & Pay</h3>
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold text-gray-800">Booking Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
//                 {teacher?.name?.split(' ').map(n => n[0]).join('') || "??"}
//               </div>
//               <div>
//                 <p className="font-medium text-gray-800">{teacher?.name || "Unknown Teacher"}</p>
//                 <p className="text-sm text-gray-500">{teacher?.teachingSkills?.[0] || "Unknown Skill"} Teacher</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h4 className="font-semibold text-gray-800">Session Details</h4>
//               <div className="flex items-center text-gray-600">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 <span>{selectedDate ? selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' }) : "Not selected"}</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Clock className="h-5 w-5 mr-2" />
//                 <span>{selectedSlot?.time || "Not selected"}</span>
//               </div>
//             </div>

//             <div className="border-t pt-6">
//               <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Session Fee</span>
//                 <span>${teacher?.hourlyRate || 0}.00</span>
//               </div>
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Platform Fee</span>
//                 <span>$2.00</span>
//               </div>
//               <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
//                 <span>Total</span>
//                 <span>${(teacher?.hourlyRate || 0) + 2}.00</span>
//               </div>
//             </div>

//             {error && <p className="text-red-500 text-center">{error}</p>}
//           </CardContent>
//           <CardFooter className="flex justify-end space-x-2">
//             <button
//               onClick={handlePrev}
//               className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleNext}
//               className="inline-flex items-center rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
//             >
//               <CreditCard className="mr-2 h-4 w-4" />
//               Pay Now
//             </button>
//           </CardFooter>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default BookSession;






// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useParams, useNavigate } from "react-router-dom";
// import { Calendar as CalendarIcon, Clock, ArrowRight, CreditCard } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar"; // Your custom Calendar component
// import { useAuth } from "../../contexts/AuthContext";
// import { useSession } from "../../contexts/SessionContext";

// const steps = [
//   { value: "date", label: "Select Date & Time" },
//   { value: "payment", label: "Review & Pay" },
// ];

// const BookSession = () => {
//   const { teacherId } = useParams();
//   const navigate = useNavigate();
//   const { api, user } = useAuth();
//   const { handlePaymentSuccess, error } = useSession();
//   const [step, setStep] = useState("date");
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [teacher, setTeacher] = useState(null);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchTeacherData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       if (!api) throw new Error("API instance is undefined");
//       const response = await api.get(`/api/teacher-profiles/${teacherId}`);
//       setTeacher(response.data);

//       const availabilityStrings = response.data.availability; 

//       if (!Array.isArray(availabilityStrings)) {
//         console.error("Availability received is not an array of strings:", availabilityStrings);
//         setAvailableSlots([]);
//         return;
//       }

//       const parsedAvailability = availabilityStrings.map(itemString => {
//         // Example itemString: "2025-07-31 09:00-10:00, 10:00-11:00"
        
//         // --- FIX FOR MULTIPLE SLOTS PARSING ---
//         // Find the index of the first space to correctly separate date from all slots
//         const firstSpaceIndex = itemString.indexOf(' ');
//         if (firstSpaceIndex === -1) { // Handle case where there's no space (malformed string)
//             console.warn("Invalid availability string format (missing space between date and slots):", itemString);
//             return null;
//         }
//         const datePart = itemString.substring(0, firstSpaceIndex);
//         const timeSlotsPart = itemString.substring(firstSpaceIndex + 1); // Get the rest of the string

//         // Create Date object in local time to avoid timezone issues
//         const [year, month, day] = datePart.split('-').map(Number);
//         const dateObj = new Date(year, month - 1, day); 

//         if (isNaN(dateObj.getTime())) { 
//             console.warn("Invalid date part in availability string:", datePart);
//             return null;
//         }

//         // Now, split timeSlotsPart by ", " to get individual slot strings
//         const slots = timeSlotsPart.split(', ').map(slotString => {
//           const [startTime, endTime] = slotString.split('-');
//           if (!startTime || !endTime) {
//               console.warn("Invalid slot string format:", slotString);
//               return null;
//           }
//           return { startTime, endTime, available: true }; 
//         }).filter(Boolean); 

//         return { date: dateObj, slots };
//       }).filter(Boolean); 

//       setAvailableSlots(parsedAvailability);
//       console.log("Parsed availableSlots:", parsedAvailability);
//     } catch (error) {
//       console.error("Error fetching teacher data:", error);
//       alert("Failed to load teacher data or availability. Please try again.");
//       setTeacher(null);
//       setAvailableSlots([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [api, teacherId]);

//   useEffect(() => {
//     fetchTeacherData();
//   }, [fetchTeacherData]);

//   useEffect(() => {
//     if (step === "date") {
//       if (selectedDate && selectedSlot) setProgress(50);
//       else if (selectedDate || selectedSlot) setProgress(25);
//       else setProgress(0);
//     } else if (step === "payment") {
//       setProgress(100);
//     }
//   }, [step, selectedDate, selectedSlot]);

//   const handleNext = () => {
//     if (step === "date") {
//       if (!selectedDate) {
//         alert("Please select a date.");
//         return;
//       }
//       if (!selectedSlot) {
//         alert("Please select a time slot.");
//         return;
//       }
//       if (!selectedSlot.available) {
//         alert("The selected time slot is no longer available. Please choose another.");
//         setSelectedSlot(null);
//         return;
//       }
//       setStep("payment");
//     } else if (step === "payment") {
//       handlePayment(); 
//     }
//   };

//   const handlePrev = () => {
//     if (step === "payment") {
//       setStep("date");
//       setProgress(50);
//     }
//   };

//   const handlePayment = async () => {
//     if (!teacher || !selectedDate || !selectedSlot) {
//       alert("Please complete all details before payment.");
//       return;
//     }

//     const selectedDateForBackend = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

//     const teacherData = {
//       name: teacher.name,
//       skill: teacher.teachingSkills?.[0] || "Unknown",
//       dateTime: selectedDateForBackend, 
//       startTime: selectedSlot.startTime,
//       endTime: selectedSlot.endTime,
//       teacherId: teacherId,
//     };

//     try {
//       await handlePaymentSuccess(teacherData); 
      
//       navigate("/student/overview"); 

//     } catch (err) {
//       console.error("Payment process failed:", err);
//     }
//   };

//   const handleSelectDate = (date) => {
//     setSelectedDate(date instanceof Date ? date : null);
//     setSelectedSlot(null);
//     setProgress(date ? 25 : 0);
//   };

//   const handleSelectSlot = (slot) => {
//     if (!slot.available) {
//       alert("This slot is already booked. Please choose another.");
//       return;
//     }
//     setSelectedSlot(slot);
//     setProgress(selectedDate ? 50 : 25);
//   };

//   const getAvailableSlotsForDate = useCallback(() => {
//     if (!selectedDate) return [];

//     const selectedDateLocalISO = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

//     const foundAvailability = availableSlots.find(item => {
//       const itemDateLocalISO = `${item.date.getFullYear()}-${(item.date.getMonth() + 1).toString().padStart(2, '0')}-${item.date.getDate().toString().padStart(2, '0')}`;
//       return itemDateLocalISO === selectedDateLocalISO;
//     });

//     if (!foundAvailability) return [];

//     return foundAvailability.slots.map((slot, index) => ({
//       id: `${selectedDateLocalISO}-${slot.startTime}-${slot.endTime}-${index}`,
//       time: `${slot.startTime} - ${slot.endTime}`,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       available: slot.available,
//     }));
//   }, [selectedDate, availableSlots]);

//   const isDateDisabled = useCallback((date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); 
//     const compareDate = new Date(date);
//     compareDate.setHours(0, 0, 0, 0); 

//     if (compareDate < today) return true; 

//     const calendarDateLocalISO = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

//     return !availableSlots.some(item => {
//       const itemDateLocalISO = `${item.date.getFullYear()}-${(item.date.getMonth() + 1).toString().padStart(2, '0')}-${item.date.getDate().toString().padStart(2, '0')}`;
      
//       return itemDateLocalISO === calendarDateLocalISO && item.slots.some(slot => slot.available);
//     });
//   }, [availableSlots]); 

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className="space-y-8 max-w-3xl mx-auto p-6"
//     >
//       <div className="text-center">
//         <h2 className="text-3xl font-bold text-orange-600 mb-2">Book a Session</h2>
//         <p className="text-lg text-gray-600">
//           Schedule your session with <span className="font-semibold">{teacher?.name || "Unknown Teacher"}</span>
//         </p>
//       </div>

//       <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//         <motion.div
//           className="bg-orange-500 h-2.5 rounded-full absolute top-0 left-0"
//           style={{ width: `${progress}%` }}
//           transition={{ duration: 0.5, ease: "easeInOut" }}
//         ></motion.div>
//       </div>

//       <div className="flex justify-between text-sm text-gray-500 mt-2">
//         {steps.map((s, index) => (
//           <span
//             key={s.value}
//             className={
//               index <= steps.findIndex(stepItem => stepItem.value === step)
//                 ? "text-orange-600 font-semibold"
//                 : ""
//             }
//           >
//             {s.label}
//           </span>
//         ))}
//       </div>

//       <Card className="shadow-xl rounded-lg overflow-hidden">
//         <div className={`p-8 ${step !== "date" && "hidden"}`}>
//           <h3 className="text-xl font-semibold text-gray-800 mb-6">1. Select Date & Time</h3>
//           <div className="grid gap-8 md:grid-cols-2">
//             <div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
//               <Calendar
//                 mode="single"
//                 selected={selectedDate}
//                 onSelect={handleSelectDate}
//                 className="rounded-md border shadow-sm"
//                 disabled={isDateDisabled} 
//               />
//             </div>
//             <div>
//               <h4 className="text-lg font-medium text-gray-700 mb-2">Available Time Slots</h4>
//               {!selectedDate ? (
//                 <p className="text-gray-500">Please select a date to see available time slots.</p>
//               ) : isLoading ? (
//                 <p className="text-gray-500">Loading slots...</p>
//               ) : getAvailableSlotsForDate().length === 0 ? (
//                 <p className="text-gray-500">No available slots for this date.</p>
//               ) : (
//                 <div className="space-y-3">
//                   {getAvailableSlotsForDate().map((slot) => (
//                     <button
//                       key={slot.id}
//                       onClick={() => handleSelectSlot(slot)}
//                       className={`w-full flex items-center justify-between rounded-md border p-3 transition-colors ${
//                         selectedSlot?.id === slot.id
//                           ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
//                           : "hover:bg-gray-50"
//                       }
//                       ${
//                         !slot.available
//                           ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
//                           : ""
//                       }`}
//                       disabled={!slot.available}
//                     >
//                       <div className="flex items-center">
//                         <Clock className="h-5 w-5 mr-2 text-gray-500" />
//                         <span>{slot.time}</span>
//                       </div>
//                       {!slot.available && <span className="text-red-500 text-sm font-semibold">Booked</span>}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//           <CardFooter className="flex justify-end mt-8">
//             <button
//               onClick={handleNext}
//               disabled={!selectedDate || !selectedSlot || isLoading || !selectedSlot?.available}
//               className="inline-flex items-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
//             >
//               Continue <ArrowRight className="ml-2 h-4 w-4" />
//             </button>
//           </CardFooter>
//         </div>

//         <div className={`p-8 ${step !== "payment" && "hidden"}`}>
//           <h3 className="text-xl font-semibold text-gray-800 mb-6">2. Review & Pay</h3>
//           <CardHeader className="pb-4">
//             <CardTitle className="text-lg font-semibold text-gray-800">Booking Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
//                 {teacher?.name?.split(' ').map(n => n[0]).join('') || "??"}
//               </div>
//               <div>
//                 <p className="font-medium text-gray-800">{teacher?.name || "Unknown Teacher"}</p>
//                 <p className="text-sm text-gray-500">{teacher?.teachingSkills?.[0] || "Unknown Skill"} Teacher</p>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <h4 className="font-semibold text-gray-800">Session Details</h4>
//               <div className="flex items-center text-gray-600">
//                 <CalendarIcon className="h-5 w-5 mr-2" />
//                 <span>{selectedDate ? selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' }) : "Not selected"}</span>
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Clock className="h-5 w-5 mr-2" />
//                 <span>{selectedSlot?.time || "Not selected"}</span>
//               </div>
//             </div>

//             <div className="border-t pt-6">
//               <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Session Fee</span>
//                 <span>${teacher?.hourlyRate || 0}.00</span>
//               </div>
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Platform Fee</span>
//                 <span>$2.00</span>
//               </div>
//               <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
//                 <span>Total</span>
//                 <span>${(teacher?.hourlyRate || 0) + 2}.00</span>
//               </div>
//             </div>

//             {error && <p className="text-red-500 text-center">{error}</p>}
//           </CardContent>
//           <CardFooter className="flex justify-end space-x-2">
//             <button
//               onClick={handlePrev}
//               className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
//             >
//               Back
//             </button>
//             <button
//               onClick={handleNext} 
//               className="inline-flex items-center rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
//             >
//               <CreditCard className="mr-2 h-4 w-4" />
//               Pay Now
//             </button>
//           </CardFooter>
//         </div>
//       </Card>
//     </motion.div>
//   );
// };

// export default BookSession;





import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, ArrowRight, CreditCard } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"; // Your custom Calendar component
import { useAuth } from "../../contexts/AuthContext";
import { useSession } from "../../contexts/SessionContext";

const steps = [
  { value: "date", label: "Select Date & Time" },
  { value: "payment", label: "Review & Pay" },
];

const BookSession = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const { handlePaymentSuccess, error } = useSession();
  const [step, setStep] = useState("date");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacherData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!api) throw new Error("API instance is undefined");
      const response = await api.get(`/api/teacher-profiles/${teacherId}`);
      setTeacher(response.data);

      // --- CRITICAL CHANGE HERE: Parse the new structured availability data ---
      const availabilityData = response.data.availability;

      if (!Array.isArray(availabilityData)) {
        console.error("Availability received is not an array (expected array of objects):", availabilityData);
        setAvailableSlots([]);
        return;
      }

      const parsedAvailability = availabilityData.map(item => {
        // item.date is expected to be an ISO date string (e.g., "2025-07-29T00:00:00.000Z")
        const dateObj = new Date(item.date); // Create Date object directly from ISO string

        if (isNaN(dateObj.getTime())) {
          console.warn("Invalid date part in availability item:", item.date);
          return null; // Skip malformed dates
        }

        // Ensure item.slots is an array before mapping
        const slots = Array.isArray(item.slots) ? item.slots.map(slot => {
          // Each slot object should directly have startTime, endTime, and available
          return {
            startTime: slot.startTime,
            endTime: slot.endTime,
            // Ensure 'available' is a boolean, default to true if missing (for safety)
            available: typeof slot.available === 'boolean' ? slot.available : true
          };
        }).filter(Boolean) : []; // Filter out any nulls if inner slot parsing fails (shouldn't happen with valid data)
        
        return { date: dateObj, slots };
      }).filter(Boolean); // Filter out any nulls from malformed date items

      setAvailableSlots(parsedAvailability);
      console.log("Parsed availableSlots (after new structure):", parsedAvailability);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      alert("Failed to load teacher data or availability. Please try again.");
      setTeacher(null);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  }, [api, teacherId]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  useEffect(() => {
    if (step === "date") {
      if (selectedDate && selectedSlot) setProgress(50);
      else if (selectedDate || selectedSlot) setProgress(25);
      else setProgress(0);
    } else if (step === "payment") {
      setProgress(100);
    }
  }, [step, selectedDate, selectedSlot]);

  const handleNext = () => {
    if (step === "date") {
      if (!selectedDate) {
        alert("Please select a date.");
        return;
      }
      if (!selectedSlot) {
        alert("Please select a time slot.");
        return;
      }
      // This check is already correctly preventing selection of unavailable slots
      if (!selectedSlot.available) {
        alert("The selected time slot is no longer available. Please choose another.");
        setSelectedSlot(null); // Clear selection if it became unavailable
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      handlePayment();
    }
  };

  const handlePrev = () => {
    if (step === "payment") {
      setStep("date");
      setProgress(50);
    }
  };

  const handlePayment = async () => {
    if (!teacher || !selectedDate || !selectedSlot) {
      alert("Please complete all details before payment.");
      return;
    }

    // This date format is correct for your backend (YYYY-MM-DD)
    const selectedDateForBackend = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const teacherData = {
      name: teacher.name,
      skill: teacher.teachingSkills?.[0] || "Unknown",
      dateTime: selectedDateForBackend,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      teacherId: teacherId,
    };

    try {
      await handlePaymentSuccess(teacherData);
      
      // Optionally, refetch teacher data here to show updated availability
      // fetchTeacherData(); // Consider if you want this component to reflect the change immediately

      navigate("/student/overview");

    } catch (err) {
      console.error("Payment process failed:", err);
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date instanceof Date ? date : null);
    setSelectedSlot(null); // Clear slot selection when date changes
    setProgress(date ? 25 : 0);
  };

  const getAvailableSlotsForDate = useCallback(() => {
    if (!selectedDate) return [];

    // Format selectedDate to match the format of dates in availableSlots for comparison
    const selectedDateLocalISO = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const foundAvailability = availableSlots.find(item => {
      // Ensure item.date is a Date object and format it for comparison
      const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
      return itemDateLocalISO === selectedDateLocalISO;
    });

    if (!foundAvailability) return [];

    // Map slots, including the 'available' status
    return foundAvailability.slots.map((slot, index) => ({
      id: `${selectedDateLocalISO}-${slot.startTime}-${slot.endTime}-${index}`,
      time: `${slot.startTime} - ${slot.endTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: slot.available, // Pass the 'available' status through
    }));
  }, [selectedDate, availableSlots]);

  const isDateDisabled = useCallback((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day
    
    const compareDate = new Date(date); // Create new Date object from the calendar date
    compareDate.setHours(0, 0, 0, 0); // Normalize compareDate to start of day

    // Disable dates in the past
    if (compareDate < today) return true;

    // Format the date to match how availableSlots are compared
    const calendarDateLocalISO = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // Disable dates for which there are no available slots
    return !availableSlots.some(item => {
      // Ensure item.date is a Date object and format it for comparison
      const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
      return itemDateLocalISO === calendarDateLocalISO && item.slots.some(slot => slot.available);
    });
  }, [availableSlots]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-3xl mx-auto p-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-2">Book a Session</h2>
        <p className="text-lg text-gray-600">
          Schedule your session with <span className="font-semibold">{teacher?.name || "Unknown Teacher"}</span>
        </p>
      </div>

      <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-orange-500 h-2.5 rounded-full absolute top-0 left-0"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mt-2">
        {steps.map((s, index) => (
          <span
            key={s.value}
            className={
              index <= steps.findIndex(stepItem => stepItem.value === step)
                ? "text-orange-600 font-semibold"
                : ""
            }
          >
            {s.label}
          </span>
        ))}
      </div>

      <Card className="shadow-xl rounded-lg overflow-hidden">
        <div className={`p-8 ${step !== "date" && "hidden"}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">1. Select Date & Time</h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                className="rounded-md border shadow-sm"
                disabled={isDateDisabled}
              />
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Available Time Slots</h4>
              {!selectedDate ? (
                <p className="text-gray-500">Please select a date to see available time slots.</p>
              ) : isLoading ? (
                <p className="text-gray-500">Loading slots...</p>
              ) : getAvailableSlotsForDate().length === 0 ? (
                <p className="text-gray-500">No available slots for this date.</p>
              ) : (
                <div className="space-y-3">
                  {getAvailableSlotsForDate().map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSelectSlot(slot)}
                      className={`w-full flex items-center justify-between rounded-md border p-3 transition-colors ${
                        selectedSlot?.id === slot.id
                          ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
                          : "hover:bg-gray-50"
                      }
                      ${
                        !slot.available // Apply booked styling if not available
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                          : ""
                      }`}
                      disabled={!slot.available} // Disable button if not available
                    >
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{slot.time}</span>
                      </div>
                      {!slot.available && <span className="text-red-500 text-sm font-semibold">Booked</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              // Disable if no date/slot selected, or if selected slot is not available
              disabled={!selectedDate || !selectedSlot || isLoading || !selectedSlot?.available}
              className="inline-flex items-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </CardFooter>
        </div>

        <div className={`p-8 ${step !== "payment" && "hidden"}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">2. Review & Pay</h3>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                {teacher?.name?.split(' ').map(n => n[0]).join('') || "??"}
              </div>
              <div>
                <p className="font-medium text-gray-800">{teacher?.name || "Unknown Teacher"}</p>
                <p className="text-sm text-gray-500">{teacher?.teachingSkills?.[0] || "Unknown Skill"} Teacher</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Session Details</h4>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{selectedDate ? selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' }) : "Not selected"}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span>{selectedSlot?.time || "Not selected"}</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-800 mb-3">Payment Summary</h4>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Session Fee</span>
                <span>${teacher?.hourlyRate || 0}.00</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Platform Fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>${(teacher?.hourlyRate || 0) + 2}.00</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <button
              onClick={handlePrev}
              className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="inline-flex items-center rounded-md text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay Now
            </button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookSession;
