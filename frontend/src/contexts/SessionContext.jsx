
// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { useAuth } from "./AuthContext";
// import useRazorpayScript from "../hooks/useRazorpayScript"; 

// const SessionContext = createContext();

// export function SessionProvider({ children }) {
//   const { api, user } = useAuth();
//   const { scriptLoaded, scriptError } = useRazorpayScript(); 
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchSessions = useCallback(async () => {
//     if (!api || !user?.id || !user.paymentAcknowledged) {
//       setError("Payment not acknowledged or authentication required.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get("/api/student/sessions");
//       console.log("API Response:", response.data);
//       const data = response.data || {};
//       let upcomingData = [], pastData = [];
//       if (Array.isArray(data)) {
//         const now = new Date();
//         upcomingData = data.filter((s) => new Date(s.dateTime) > now);
//         pastData = data.filter((s) => new Date(s.dateTime) <= now);
//       } else if (data.upcoming && data.past) {
//         upcomingData = data.upcoming || [];
//         pastData = data.past || [];
//       }
//       setUpcoming(upcomingData);
//       setPast(pastData);
//     } catch (err) {
//       console.error("Error fetching sessions:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//         url: err.response?.config?.url,
//       });
//       setError(`Failed to load sessions: ${err.message}. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   }, [api, user?.id, user?.paymentAcknowledged]);

//   const handlePaymentSuccess = useCallback(async (teacherData) => {
//     if (!api || !user?.id) {
//       setError("Authentication required or API not available.");
//       return;
//     }

//     // --- START OF MODIFICATION ---
//     if (!scriptLoaded) {
//       console.error("Razorpay SDK not loaded.");
//       setError("Payment gateway not ready. Please try again in a moment.");
//       return;
//     }
//     if (scriptError) {
//       console.error("Razorpay SDK load error:", scriptError);
//       setError("Failed to load payment gateway. Please refresh or check your internet.");
//       return;
//     }
//     if (!window.Razorpay) { // Double-check just in case scriptLoaded is true but global object isn't there
//       console.error("window.Razorpay is still undefined after script loaded.");
//       setError("Payment gateway not fully initialized. Please try again.");
//       return;
//     }
//     // --- END OF MODIFICATION ---

//     try {
//       const { data } = await api.post("/api/create-payment-order", {
//         amount: 100, // Test amount in INR (1 INR = 100 paise)
//         currency: "INR",
//         teacherData,
//       });
//       const options = {
//         key: "rzp_test_59BvySck8scTA8",
//         amount: data.amount,
//         currency: data.currency,
//         order_id: data.orderId,
//         name: "Vidyapaalam",
//         description: `Session with ${teacherData.name}`,
//         handler: async (response) => {
//           console.log("Payment Success:", response);
//           alert("Payment successful! Your session is booked."); // Added an alert for success
//           await fetchSessions();
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//         },
//         theme: {
//           color: "#F7931E",
//         },
//         modal: {
//           ondismiss: () => {
//             setError("Payment cancelled by user. Please try again.");
//             fetchSessions();
//           },
//         },
//       };
//       const rzp = new window.Razorpay(options); // This line should now work
//       rzp.open();
//     } catch (err) {
//       console.error("Error initiating payment:", err.response?.data || err.message);
//       setError(`Payment failed: ${err.message}. Please try again or contact support.`);
//     }
//   }, [api, user?.id, user?.name, user?.email, fetchSessions, scriptLoaded, scriptError]); // <--- ADDED DEPENDENCIES

//   useEffect(() => {
//     fetchSessions();
//   }, [fetchSessions]);

//   const value = {
//     upcoming,
//     past,
//     loading,
//     error,
//     fetchSessions,
//     handlePaymentSuccess,
//     scriptLoaded, // Expose scriptLoaded and scriptError
//     scriptError,
//   };

//   return (
//     <SessionContext.Provider value={value}>
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export const useSession = () => {
//   const context = useContext(SessionContext);
//   if (!context) {
//     throw new Error("useSession must be used within a SessionProvider");
//   }
//   return context;
// };






// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { useAuth } from "./AuthContext";
// import useRazorpayScript from "../hooks/useRazorpayScript";

// const SessionContext = createContext();

// export function SessionProvider({ children }) {
//   const { api, user } = useAuth();
//   const { scriptLoaded, scriptError } = useRazorpayScript();
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchSessions = useCallback(async () => {
//     console.log("fetchSessions: user object state on call", user);
//     console.log("fetchSessions: user?.id", user?.id);
//     console.log("fetchSessions: user?.paymentAcknowledged", user?.paymentAcknowledged);

//     if (!api || !user?.id || !user.paymentAcknowledged) {
//       setError("Payment not acknowledged or authentication required.");
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get("/api/student/sessions");
//       console.log("API Response:", response.data);
//       const data = response.data || {};
//       let upcomingData = [], pastData = [];
//       if (Array.isArray(data)) {
//         const now = new Date();
//         upcomingData = data.filter((s) => new Date(s.dateTime) > now);
//         pastData = data.filter((s) => new Date(s.dateTime) <= now);
//       } else if (data.upcoming && data.past) {
//         upcomingData = data.upcoming || [];
//         pastData = data.past || [];
//       }
//       setUpcoming(upcomingData);
//       setPast(pastData);
//     } catch (err) {
//       console.error("Error fetching sessions:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//         url: err.response?.config?.url,
//       });
//       setError(`Failed to load sessions: ${err.message}. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   }, [api, user?.id, user?.paymentAcknowledged]);

//   const handlePaymentSuccess = useCallback(async (teacherData) => {
//     if (!api || !user?.id) {
//       setError("Authentication required or API not available.");
//       return;
//     }

//     if (!scriptLoaded) {
//       console.error("Razorpay SDK not loaded.");
//       setError("Payment gateway not ready. Please try again in a moment.");
//       return;
//     }
//     if (scriptError) {
//       console.error("Razorpay SDK load error:", scriptError);
//       setError("Failed to load payment gateway. Please refresh or check your internet.");
//       return;
//     }
//     if (!window.Razorpay) {
//       console.error("window.Razorpay is still undefined after script loaded.");
//       setError("Payment gateway not fully initialized. Please try again.");
//       return;
//     }

//     try {
//       const { data } = await api.post("/api/create-payment-order", {
//         amount: 100,
//         currency: "INR",
//         teacherData,
//       });
//       const options = {
//         key: "rzp_test_59BvySck8scTA8",
//         amount: data.amount,
//         currency: data.currency,
//         order_id: data.orderId,
//         name: "Vidyapaalam",
//         description: `Session with ${teacherData.name}`,
//         handler: async (response) => {
//           console.log("Payment Success:", response);
//           alert("Payment successful! Your session is booked.");
//           await fetchSessions();
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//         },
//         theme: {
//           color: "#F7931E",
//         },
//         modal: {
//           ondismiss: () => {
//             setError("Payment cancelled by user. Please try again.");
//             fetchSessions();
//           },
//         },
//       };
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error("Error initiating payment:", err.response?.data || err.message);
//       setError(`Payment failed: ${err.message}. Please try again or contact support.`);
//     }
//   }, [api, user?.id, user?.name, user?.email, fetchSessions, scriptLoaded, scriptError]);

//   useEffect(() => {
//     fetchSessions();
//   }, [fetchSessions]);

//   const value = {
//     upcoming,
//     past,
//     loading,
//     error,
//     fetchSessions,
//     handlePaymentSuccess,
//     scriptLoaded,
//     scriptError,
//   };

//   return (
//     <SessionContext.Provider value={value}>
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export const useSession = () => {
//   const context = useContext(SessionContext);
//   if (!context) {
//     throw new Error("useSession must be used within a SessionProvider");
//   }
//   return context;
// };





import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import useRazorpayScript from "../hooks/useRazorpayScript";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const { api, user } = useAuth();
  const { scriptLoaded, scriptError } = useRazorpayScript();
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    if (!api || !user?.id || !user.paymentAcknowledged) {
      console.warn("fetchSessions: Missing API, User ID, or Payment Acknowledgment.");
      setError("Payment not acknowledged or authentication required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/student/sessions");
      const data = response.data || [];

      const now = new Date(); // Current date and time
      console.log(`Current Client Time (now): ${now.toLocaleString()}`);
      console.log(`Current Client Time (ISO): ${now.toISOString()}`);


      const upcomingSessions = [];
      const pastSessions = [];

      if (Array.isArray(data)) {
        data.forEach((session, index) => {
          console.groupCollapsed(`Processing Session ${index + 1}: ${session._id || 'New Session'}`);
          console.log("Raw Session Data:", session);

          // Construct full Date objects for comparison
          // Assuming session.dateTime is 'YYYY-MM-DD' and session.startTime/endTime are 'HH:MM'
          const sessionStartDateTime = new Date(`${session.dateTime}T${session.startTime}:00`);
          const sessionEndDateTime = new Date(`${session.dateTime}T${session.endTime}:00`);

          console.log(`  Session dateTime: ${session.dateTime}`);
          console.log(`  Session startTime: ${session.startTime}`);
          console.log(`  Session endTime: ${session.endTime}`);
          console.log(`  Constructed Start DateTime: ${sessionStartDateTime.toLocaleString()} (ISO: ${sessionStartDateTime.toISOString()})`);
          console.log(`  Constructed End DateTime: ${sessionEndDateTime.toLocaleString()} (ISO: ${sessionEndDateTime.toISOString()})`);

          if (isNaN(sessionStartDateTime.getTime()) || isNaN(sessionEndDateTime.getTime())) {
            console.error(`  ERROR: Invalid Date constructed for session ${session._id}. Check dateTime/startTime/endTime formats.`);
            // You might want to skip this session or put it in an error state
            pastSessions.push(session); // Or handle invalid sessions as needed
          } else if (sessionEndDateTime > now) {
            console.log(`  Comparison: Session End Time (${sessionEndDateTime.toLocaleString()}) > Current Time (${now.toLocaleString()}) -> UPCOMING`);
            upcomingSessions.push(session);
          } else {
            console.log(`  Comparison: Session End Time (${sessionEndDateTime.toLocaleString()}) <= Current Time (${now.toLocaleString()}) -> PAST`);
            pastSessions.push(session);
          }
          console.groupEnd();
        });

        upcomingSessions.sort((a, b) =>
            new Date(`${a.dateTime}T${a.startTime}:00`).getTime() -
            new Date(`${b.dateTime}T${b.startTime}:00`).getTime()
        );

        pastSessions.sort((a, b) =>
            new Date(`${b.dateTime}T${b.startTime}:00`).getTime() -
            new Date(`${a.dateTime}T${a.startTime}:00`).getTime()
        );

        setUpcoming(upcomingSessions);
        setPast(pastSessions);
        console.log("Final Upcoming Sessions Array:", upcomingSessions);
        console.log("Final Past Sessions Array:", pastSessions);
      } else {
        console.warn("API response is not an array. Assuming object with upcoming/past keys.");
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      }

    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(`Failed to load sessions: ${err.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [api, user?.id, user?.paymentAcknowledged]);

  const handlePaymentSuccess = useCallback(async (teacherData) => {
    if (!api || !user?.id) {
      setError("Authentication required or API not available.");
      return;
    }

    if (!scriptLoaded) {
      setError("Payment gateway not ready. Please try again in a moment.");
      return;
    }
    if (scriptError) {
      setError("Failed to load payment gateway. Please refresh or check your internet.");
      return;
    }
    if (!window.Razorpay) {
      setError("Payment gateway not fully initialized. Please try again.");
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
          await fetchSessions();
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
            setError("Payment cancelled by user. Please try again.");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(`Payment initiation failed: ${err.message}. Please try again or contact support.`);
    }
  }, [api, user?.id, user?.name, user?.email, fetchSessions, scriptLoaded, scriptError]);

  useEffect(() => {
    fetchSessions();
    const intervalId = setInterval(fetchSessions, 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchSessions]);

  const value = {
    upcoming,
    past,
    loading,
    error,
    fetchSessions,
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
