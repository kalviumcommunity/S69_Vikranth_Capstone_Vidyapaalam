

// src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// const api = axios.create({
//   baseURL: "http://localhost:3400",
//   withCredentials: true,
// });

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/auth/profile");
//       setUser(data);
//     } catch (err) {
//       console.error("Error fetching user:", err.response?.data || err.message);
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load user once on mount
//   useEffect(() => {
//     fetchUser();
//   }, []);

//   const login = async (email, password) => {
//     await api.post("/auth/login", { email, password });
//     await fetchUser();
//   };

//   const signup = async (name, email, password) => {
//     await api.post("/auth/signup", { name, email, password });
//     await fetchUser();
//   };

//   const logout = async () => {
//     await api.post("/auth/logout");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         signup,
//         logout,
//         fetchUser,
//         api,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const api = axios.create({
  baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
  withCredentials: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // useCallback to memoize fetchUser and prevent unnecessary re-renders/useEffect triggers
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile");
      setUser(data);
      return data; // Return the fetched user data
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err.message);
      setUser(null);
      return null; // Return null on error
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

   useEffect(() => {
    const tokenExists = Cookies.get("accessToken"); // ✅ Replace with your actual cookie key name
    if (tokenExists) {
      fetchUser();
    } else {
      setLoading(false); // ✅ Avoid staying in loading state forever
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    const userData = await fetchUser(); // Fetch the newly logged-in user's data
    return userData; // <-- IMPORTANT: Return the user data
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    const userData = await fetchUser(); // Fetch the newly signed-up user's data
    return userData; // <-- IMPORTANT: Return the user data
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
      throw error; // Propagate error if needed
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, // Renamed from 'user' to 'currentUser' for clarity, but keeping 'user' for now to match your code.
        loading,
        login,
        signup,
        logout,
        fetchUser,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}