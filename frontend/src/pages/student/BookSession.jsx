import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, ArrowRight, CreditCard } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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

        const response = await api.get(`/api/teacher-profiles/teacher-profiles-for-booking/${teacherId}`);

        console.log("Teacher data received on frontend:", response.data); 

        
        setTeacher(response.data); 

        const availabilityData = response.data.availability;

        if (!Array.isArray(availabilityData)) {
            console.error("Availability received is not an array (expected array of objects):", availabilityData);
            setAvailableSlots([]);
            return;
        }

        const parsedAvailability = availabilityData.map(item => {
            const dateObj = new Date(item.date); 

            if (isNaN(dateObj.getTime())) {
                console.warn("Invalid date part in availability item (frontend parse):", item.date);
                return null; 
            }
            
            const slots = Array.isArray(item.slots) ? item.slots.map(slot => {
                return {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    available: typeof slot.available === 'boolean' ? slot.available : true
                };
            }).filter(Boolean) : [];
            
            return { date: dateObj, slots };
        }).filter(Boolean);

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
      if (!selectedSlot.available) {
        alert("The selected time slot is no longer available. Please choose another.");
        setSelectedSlot(null);
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

    const selectedDateForBackend = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const teacherData = {
      name: teacher.name,
      dateTime: selectedDateForBackend,
      skill: teacher.teachingSkills?.[0] || "Unknown",
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      teacherId: teacher.actualUserId,
    };

    try {
      await handlePaymentSuccess(teacherData);
      
      navigate("/student/overview");

    } catch (err) {
      console.error("Payment process failed:", err);
    }
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date instanceof Date ? date : null);
    setSelectedSlot(null);
    setProgress(date ? 25 : 0);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setProgress(50);
  };

  const getAvailableSlotsForDate = useCallback(() => {
    if (!selectedDate) return [];

    const selectedDateLocalISO = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    const foundAvailability = availableSlots.find(item => {
      const itemDateObj = item.date instanceof Date ? item.date : new Date(item.date);
      const itemDateLocalISO = `${itemDateObj.getFullYear()}-${(itemDateObj.getMonth() + 1).toString().padStart(2, '0')}-${itemDateObj.getDate().toString().padStart(2, '0')}`;
      
      return itemDateLocalISO === selectedDateLocalISO;
    });

    if (!foundAvailability) return [];

      const sortedSlots = [...foundAvailability.slots].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    }); 

    return sortedSlots.map((slot, index) => ({
      id: `${selectedDateLocalISO}-${slot.startTime}-${slot.endTime}-${index}`,
      time: `${slot.startTime} - ${slot.endTime}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: slot.available,
    }));
  }, [selectedDate, availableSlots]);

  const isDateDisabled = useCallback((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate < today) return true;

    const calendarDateLocalISO = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    return !availableSlots.some(item => {
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
                        !slot.available
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
                          : ""
                      }`}
                      disabled={!slot.available}
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
{/*             <button
              onClick={handleNext}
              disabled={!selectedDate || !selectedSlot || isLoading || !selectedSlot?.available}
              className="inline-flex items-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 disabled:opacity-50"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button> */}

            <button
              onClick={handleNext}
              disabled={!selectedDate || !selectedSlot || isLoading || !selectedSlot?.available}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm md:text-base md:px-6 md:py-2.5 font-semibold transition-all duration-300 ease-in-out hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
            >
              Continue <ArrowRight className="h-4 w-4" />
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
