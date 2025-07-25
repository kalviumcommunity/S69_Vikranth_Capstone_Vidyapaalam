// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { useAuth } from "./AuthContext";

// const SessionContext = createContext();

// export function SessionProvider({ children }) {
//   const { api, user } = useAuth();
//   const [upcoming, setUpcoming] = useState([]);
//   const [past, setPast] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchSessions = useCallback(async () => {
//     if (!api || !user?.id) {
//       setError("Authentication required or API not available.");
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
//       setError("Failed to load sessions. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   }, [api, user?.id]);

//   const handlePaymentSuccess = useCallback(async (teacherData) => {
//     if (!api || !user?.id) {
//       setError("Authentication required or API not available.");
//       return;
//     }

//     try {
//       const newSession = {
//         teacherName: teacherData.name,
//         teacherInitials: teacherData.name
//           .split(" ")
//           .map((n) => n[0])
//           .join("")
//           .toUpperCase()
//           .slice(0, 2),
//         skill: teacherData.skill || "Unknown",
//         dateTime: teacherData.dateTime || new Date(Date.now() + 7 * 86400000).toISOString(), // Configurable dateTime
//       };
//       const response = await api.post("/api/student/sessions", newSession);
//       setUpcoming((prev) => [...prev, response.data]);
//     } catch (err) {
//       console.error("Error creating session:", err.response?.data || err.message);
//       setError("Failed to add session. Please try again.");
//     }
//   }, [api, user?.id]);

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

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const { api, user } = useAuth();
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
      console.log("API Response:", response.data);
      const data = response.data || {};
      let upcomingData = [], pastData = [];
      if (Array.isArray(data)) {
        const now = new Date();
        upcomingData = data.filter((s) => new Date(s.dateTime) > now);
        pastData = data.filter((s) => new Date(s.dateTime) <= now);
      } else if (data.upcoming && data.past) {
        upcomingData = data.upcoming || [];
        pastData = data.past || [];
      }
      setUpcoming(upcomingData);
      setPast(pastData);
    } catch (err) {
      console.error("Error fetching sessions:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.response?.config?.url,
      });
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

    try {
      const { data } = await api.post("/api/create-payment-order", {
        amount: 100, // Test amount in INR (1 INR = 100 paise)
        currency: "INR",
        teacherData,
      });
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Vidyapaalam",
        description: `Session with ${teacherData.name}`,
        handler: async (response) => {
          console.log("Payment Success:", response);
          await fetchSessions(); // Refresh sessions after payment
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
            fetchSessions(); // Refresh to check for partial updates
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Error initiating payment:", err.response?.data || err.message);
      setError(`Payment failed: ${err.message}. Please try again or contact support.`);
    }
  }, [api, user?.id, user?.name, user?.email, fetchSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const value = {
    upcoming,
    past,
    loading,
    error,
    fetchSessions,
    handlePaymentSuccess,
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


