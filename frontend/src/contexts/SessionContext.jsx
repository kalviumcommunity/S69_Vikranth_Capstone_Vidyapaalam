
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
      setError("Payment not acknowledged or authentication required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/student/sessions");
      const data = response.data || [];

      const now = new Date();

      const upcomingSessions = [];
      const pastSessions = [];

      if (Array.isArray(data)) {
        data.forEach((session) => {
          const sessionStartDateTime = new Date(`${session.dateTime}T${session.startTime}:00`);
          const sessionEndDateTime = new Date(`${session.dateTime}T${session.endTime}:00`);

          if (sessionEndDateTime > now) {
            upcomingSessions.push(session);
          } else {
            pastSessions.push(session);
          }
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
      } else {
   
        setUpcoming(data.upcoming || []);
        setPast(data.past || []);
      }

    } catch (err) {
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
        amount: 100, // Ensure this matches your actual session price
        currency: "INR",
        teacherData, // This object should contain all necessary session details for the backend
      });
      const options = {
        key: "rzp_test_59BvySck8scTA8", // Use environment variable for production
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Vidyapaalam",
        description: `Session with ${teacherData.name}`,
        handler: async (response) => {
          // Reverted to your original simpler handler logic
          alert("Payment successful! Your session is booked.");
          await fetchSessions(); // Re-fetch sessions to show the newly booked one
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
    // Keep the interval to automatically update upcoming/past sessions
    const intervalId = setInterval(fetchSessions, 60 * 1000); // Refresh every minute
    return () => clearInterval(intervalId); // Clear interval on unmount
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
