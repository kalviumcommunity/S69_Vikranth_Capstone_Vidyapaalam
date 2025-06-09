import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, ArrowRight, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Mock teacher data
const mockTeacher = {
  id: "1",
  name: "Maria Johnson",
  avatar: "/placeholder.svg",
  initials: "MJ",
  skill: "Yoga",
  hourlyRate: 30,
};

// Mock time slots (simulating availability for a specific date)
const mockTimeSlots = [
  { id: "1", time: "9:00 AM - 10:00 AM", available: true },
  { id: "2", time: "10:30 AM - 11:30 AM", available: true },
  { id: "3", time: "1:00 PM - 2:00 PM", available: true },
  { id: "4", time: "3:30 PM - 4:30 PM", available: true },
  { id: "5", time: "5:00 PM - 6:00 PM", available: false },
  { id: "6", time: "6:30 PM - 7:30 PM", available: true },
];

const steps = [
  { value: "date", label: "Select Date & Time" },
  { value: "payment", label: "Review & Pay" },
];

const BookSession = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState("date");
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState(undefined);
  const [progress, setProgress] = useState(0);

  const teacher = mockTeacher; // In a real app, fetch the teacher based on the ID
  const selectedSlot = mockTimeSlots.find(slot => slot.id === selectedSlotId);

  useEffect(() => {
    if (step === "date") {
      if (selectedDate && selectedSlotId) {
        setProgress(50);
      } else if (selectedDate || selectedSlotId) {
        setProgress(25);
      } else {
        setProgress(0);
      }
    } else if (step === "payment") {
      setProgress(100);
    }
  }, [step, selectedDate, selectedSlotId]);

  const handleNext = () => {
    if (step === "date") {
      if (!selectedDate) {
        toast({ title: "Please select a date", variant: "destructive" });
        return;
      }
      if (!selectedSlotId) {
        toast({ title: "Please select a time slot", variant: "destructive" });
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
      setProgress(50); // Reset progress when going back
    }
  };

  const handlePayment = () => {
    toast({ title: "Session booked successfully!", });
    navigate("/student/overview");
  };

  const handleSelectDate = (date) => {
    if (date instanceof Date) {
      setSelectedDate(date);
      if (selectedSlotId) {
        setProgress(50);
      } else {
        setProgress(25); // Some progress after selecting date
      }
    } else {
      setSelectedDate(undefined);
      setProgress(0);
    }
  };

  const handleSelectSlot = (slotId) => {
    setSelectedSlotId(slotId);
    if (selectedDate) {
      setProgress(50);
    } else {
      setProgress(25); // Some progress after selecting slot
    }
  };

  const availableTimeSlotsForDate = selectedDate ? mockTimeSlots : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-3xl mx-auto p-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-orange-600 mb-2">Book a Session</h2>
        <p className="text-lg text-gray-600">Schedule your session with <span className="font-semibold">{teacher.name}</span></p>
      </div>

      {/* Animated Progress Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          className="bg-orange-500 h-2.5 rounded-full absolute top-0 left-0"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        ></motion.div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mt-2">
        {steps.map((s, index) => (
          <span key={s.value} className={`${index <= steps.findIndex(stepItem => stepItem.value === step) ? 'text-orange-600 font-semibold' : ''}`}>
            {s.label}
          </span>
        ))}
      </div>

      <Card className="shadow-xl rounded-lg overflow-hidden">
        <div className={`p-8 ${step !== "date" && 'hidden'}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">1. Select Date & Time</h3>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Choose a Date</h4>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                className="rounded-md border shadow-sm"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-2">Available Time Slots</h4>
              {!selectedDate ? (
                <p className="text-gray-500">Please select a date to see available time slots.</p>
              ) : (
                <div className="space-y-3">
                  {availableTimeSlotsForDate.length > 0 ? (
                    availableTimeSlotsForDate.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSelectSlot(slot.id)}
                        className={`w-full flex items-center justify-between rounded-md border p-3 transition-colors ${
                          !slot.available
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                            : selectedSlotId === slot.id
                            ? "border-orange-500 bg-orange-50 text-orange-600 font-semibold"
                            : "hover:bg-gray-50"
                        }`}
                        disabled={!slot.available}
                      >
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-gray-500" />
                          <span>{slot.time}</span>
                        </div>
                        {!slot.available && <Badge variant="destructive">Booked</Badge>}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500">No time slots available for the selected date.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-end mt-8">
            <button
              onClick={handleNext}
              disabled={!selectedDate || !selectedSlotId}
              className="inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </CardFooter>
        </div>

        <div className={`p-8 ${step !== "payment" && 'hidden'}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">2. Review & Payment</h3>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800">Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={teacher.avatar} alt={teacher.name} />
                <AvatarFallback>{teacher.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{teacher.name}</p>
                <p className="text-sm text-gray-500">{teacher.skill} Teacher</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Session Details</h4>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>{selectedDate ? format(selectedDate, "PPP") : "Not selected"}</span>
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
                <span>${teacher.hourlyRate}.00</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Platform Fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span>${teacher.hourlyRate + 2}.00</span>
              </div>
            </div>

            <div className="border p-6 rounded-md bg-gray-50">
              <p className="text-center text-gray-500">
                Secure payment processing will be integrated here.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <button onClick={handlePrev} className="inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Back
            </button>
            <button
              onClick={handlePayment}
              className="inline-flex items-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-orange-600 text-white shadow hover:bg-orange-700 h-10 px-4 py-2"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Payment
            </button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookSession;