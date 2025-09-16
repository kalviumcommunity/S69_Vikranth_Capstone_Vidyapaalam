import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import useRazorpayScript from "../hooks/useRazorpayScript";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const { api, user } = useAuth();
  const { scriptLoaded, scriptError } = useRazorpayScript();

  const [studentUpcomingSessions, setStudentUpcomingSessions] = useState([]);
  const [studentPastSessions, setStudentPastSessions] = useState([]);

  const [teacherUpcomingSessions, setTeacherUpcomingSessions] = useState([]);
  const [teacherPastSessions, setTeacherPastSessions] = useState([]);

  const [loadingSessions, setLoadingSessions] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  const createFullDateTime = (dateString, timeString) => {
    const datePart = dateString.split('T')[0];
    return new Date(`${datePart}T${timeString}:00`);
  };

  const fetchStudentSessions = useCallback(async () => {
    if (!api || !user?.id || !user.paymentAcknowledged) {
      setStudentUpcomingSessions([]);
      setStudentPastSessions([]);
      return;
    }

    setLoadingSessions(true);
    setSessionError(null);
    try {
      const response = await api.get("/api/student/sessions");
      const data = response.data || {};

      const now = new Date();
      let allSessions = [];

      if (data.upcoming && Array.isArray(data.upcoming)) {
        allSessions = allSessions.concat(data.upcoming);
      }
      if (data.past && Array.isArray(data.past)) {
        allSessions = allSessions.concat(data.past);
      }
      if (Array.isArray(data)) {
        allSessions = allSessions.concat(data);
      }

      const tempUpcoming = [];
      const tempPast = [];

      allSessions.forEach((session) => {
        const sessionEndDateTime = createFullDateTime(session.dateTime, session.endTime);

        if (isNaN(sessionEndDateTime.getTime())) {
          console.error(`ERROR: Invalid Date constructed for student session ID ${session._id}:`, session);
          tempPast.push(session);
        } else if (sessionEndDateTime > now) {
          tempUpcoming.push(session);
        } else {
          tempPast.push(session);
        }
      });

      tempUpcoming.sort((a, b) => createFullDateTime(a.dateTime, a.startTime).getTime() - createFullDateTime(b.dateTime, b.startTime).getTime());
      tempPast.sort((a, b) => createFullDateTime(b.dateTime, b.startTime).getTime() - createFullDateTime(a.dateTime, a.startTime).getTime());

      setStudentUpcomingSessions(tempUpcoming);
      setStudentPastSessions(tempPast);

    } catch (err) {
      console.error("Error fetching student sessions:", err);
      setSessionError(`Failed to load student sessions: ${err.message}.`);
    } finally {
      setLoadingSessions(false);
    }
  }, [api, user?.id, user?.paymentAcknowledged]);

  const fetchTeacherSessions = useCallback(async () => {
    if (!api || !user?.id) {
      setTeacherUpcomingSessions([]);
      setTeacherPastSessions([]);
      return;
    }

    setLoadingSessions(true);
    setSessionError(null);
    try {
      const response = await api.get("/api/teacher/sessions");
      const data = response.data || {};

      const now = new Date();
      let allTeacherSessions = [];

      if (data.upcomingSessions && Array.isArray(data.upcomingSessions)) {
        allTeacherSessions = allTeacherSessions.concat(data.upcomingSessions);
      }
      if (data.pastSessions && Array.isArray(data.pastSessions)) {
        allTeacherSessions = allTeacherSessions.concat(data.pastSessions);
      }
      if (Array.isArray(data)) {
         allTeacherSessions = allTeacherSessions.concat(data);
      }

      const tempTeacherUpcoming = [];
      const tempTeacherPast = [];

      allTeacherSessions.forEach((session) => {
        const sessionEndDateTime = createFullDateTime(session.dateTime, session.endTime);

        if (isNaN(sessionEndDateTime.getTime())) {
          console.error(`ERROR: Invalid Date constructed for teacher session ID ${session._id}:`, session);
          tempTeacherPast.push(session);
        } else if (sessionEndDateTime > now) {
          tempTeacherUpcoming.push(session);
        } else {
          tempTeacherPast.push(session);
        }
      });

      tempTeacherUpcoming.sort((a, b) => createFullDateTime(a.dateTime, a.startTime).getTime() - createFullDateTime(b.dateTime, b.startTime).getTime());
      tempTeacherPast.sort((a, b) => createFullDateTime(b.dateTime, b.startTime).getTime() - createFullDateTime(a.dateTime, a.startTime).getTime());

      setTeacherUpcomingSessions(tempTeacherUpcoming);
      setTeacherPastSessions(tempTeacherPast);

    } catch (err) {
      console.error("Error fetching teacher sessions:", err);
      setSessionError(`Failed to load teacher sessions: ${err.message}.`);
    } finally {
      setLoadingSessions(false);
    }
  }, [api, user?.id]);

  const handlePaymentSuccess = useCallback(async (teacherData) => {
    if (!api || !user?.id) {
      setSessionError("Authentication required or API not available.");
      return;
    }

    if (!scriptLoaded) {
      setSessionError("Payment gateway not ready. Please try again in a moment.");
      return;
    }
    if (scriptError) {
      setSessionError("Failed to load payment gateway. Please refresh or check your internet.");
      return;
    }
    if (!window.Razorpay) {
      setSessionError("Payment gateway not fully initialized. Please try again.");
      return;
    }

    try {
      const { data } = await api.post("/api/create-payment-order", {
        amount: 100,
        currency: "INR",
        teacherData,
      });
      const options = {
        key: "rzp_test_59BvySck8scTA8",
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Vidyapaalam",
        description: `Session with ${teacherData.name}`,
        handler: async (response) => {
          alert("Payment successful! Your session is booked.");
          await fetchStudentSessions();
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#F7931E",
        },
        modal: {
          ondismiss: () => {
            setSessionError("Payment cancelled by user. Please try again.");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setSessionError(`Payment initiation failed: ${err.message}. Please try again or contact support.`);
    }
  }, [api, user?.id, user?.name, user?.email, fetchStudentSessions, scriptLoaded, scriptError]);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchStudentSessions();
      const intervalId = setInterval(fetchStudentSessions, 60 * 1000);
      return () => clearInterval(intervalId);
    } else if (user?.role === 'teacher') {
      fetchTeacherSessions();
      const intervalId = setInterval(fetchTeacherSessions, 60 * 1000);
      return () => clearInterval(intervalId);
    }
    setLoadingSessions(false);
  }, [user?.role, fetchStudentSessions, fetchTeacherSessions]);

  const value = {
    studentUpcomingSessions,
    studentPastSessions,
    teacherUpcomingSessions,
    teacherPastSessions,
    loadingSessions,
    sessionError,
    fetchStudentSessions,
    fetchTeacherSessions,
    handlePaymentSuccess,
    scriptLoaded,
    scriptError,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
