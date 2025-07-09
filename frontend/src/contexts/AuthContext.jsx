
// // src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// export const api = axios.create({
//   baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry &&
//       originalRequest.url !== "/auth/refreshtoken" // Changed this line to match backend route
//     ) {
//       originalRequest._retry = true;
//       console.log("Interceptor: Access token expired or invalid. Attempting to refresh token...");

//       try {
//         await axios.post(
//           "https://s69-vikranth-capstone-vidyapaalam.onrender.com/auth/refreshtoken", // Changed this line to match backend route
//           {},
//           { withCredentials: true }
//         );
//         console.log("Interceptor: Token refresh successful!");

//         return api(originalRequest);

//       } catch (refreshError) {
//         console.error("Interceptor: Token refresh failed:", refreshError.response?.data || refreshError.message);
//         Cookies.remove("accessToken", { path: '/' });
//         Cookies.remove("refreshToken", { path: '/' });
//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUser = useCallback(async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/auth/profile");
//       setUser(data);
//       return data;
//     } catch (err) {
//       console.error("Error fetching user profile:", err.response?.data || err.message);
//       setUser(null);
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         Cookies.remove("accessToken", { path: '/' });
//         Cookies.remove("refreshToken", { path: '/' });
//       }
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const tokenExists = Cookies.get("accessToken");
//     if (tokenExists) {
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, [fetchUser]);

//   const login = async (email, password) => {
//     const response = await api.post("/auth/login", { email, password });
//     const userData = await fetchUser();
//     return userData;
//   };

//   const signup = async (name, email, password) => {
//     await api.post("/auth/signup", { name, email, password });
//     const userData = await fetchUser();
//     return userData;
//   };

//   const logout = async () => {
//     try {
//       await api.post("/auth/logout");
//       setUser(null);
//       Cookies.remove("accessToken", { path: '/' });
//       Cookies.remove("refreshToken", { path: '/' });
//     } catch (error) {
//       console.error("Error logging out:", error.response?.data || error.message);
//       throw error;
//     }
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

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import { api } from "../api/axios";
import { clearAuthCookies, validateUserData } from "../utils/authUtils";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Effect to manage component mount status for preventing state updates on unmounted component
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const logout = async () => {
    try {
      // The backend /auth/logout endpoint should receive the httpOnly refreshToken
      // and handle blacklisting it, then clear both cookies via Set-Cookie headers.
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      // Always clear user state and client-side cookies on logout, regardless of API success
      if (isMountedRef.current) setUser(null);
      clearAuthCookies(); // Clears any client-side accessible cookies (if any)
      // Redirect after logout
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      // Note: setLoading(true) is managed by the calling `bootstrapAuth` for the overall auth process
      const { data } = await api.get("/auth/profile"); // Browser automatically sends httpOnly accessToken

      if (!validateUserData(data)) {
        console.warn("Invalid user data from /auth/profile:", data);
        if (isMountedRef.current) {
          setUser(null); // Clear user if data is invalid
        }
        return null;
      }

      if (isMountedRef.current) {
        setUser(data);
        return data;
      }
    } catch (err) {
      // console.error is handled in the calling bootstrapAuth for initial load errors
      // For general fetchUser calls, this catch might also trigger, but for auth bootstrapping,
      // we centralize decision making.
      console.error(
        "Failed to fetch user from /auth/profile:",
        err.response?.status,
        err.response?.data || err.message
      );
      if (isMountedRef.current) {
        setUser(null);
      }
      return null;
    } finally {
      // setLoading(false) is handled by the main useEffect after all attempts.
    }
  }, []);

  // 🚀 Corrected and robust bootstrapping logic for httpOnly cookies
  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!isMountedRef.current) return; // Immediate exit if component unmounted
      setLoading(true); // Start loading state

      try {
        // 1. Attempt to fetch user with existing access token (if any).
        // The browser will automatically send any existing httpOnly accessToken cookie
        // with this request if `api` is configured with `withCredentials: true`.
        let userData = await fetchUser();

        if (userData) {
          console.log("Authenticated: User data fetched successfully.");
          return; // Successfully authenticated, exit early
        }

        // If fetchUser returned null (e.g., because /auth/profile returned 401
        // due to an expired access token, or no token), then attempt to refresh.
        console.log("No current user data; attempting token refresh...");

        // 2. Attempt token refresh.
        // This call *must* include withCredentials: true on the axios instance.
        // The server's refresh-token endpoint will handle setting new cookies.
        await api.post("/auth/refresh-token", {}, { withCredentials: true });
        console.log("Token refresh successful. Re-fetching user data with new token...");

        // 3. Re-fetch user data after successful refresh
        userData = await fetchUser();
        if (!userData) {
          // Even after refresh, if user data can't be fetched, something is wrong.
          throw new Error("Failed to fetch user data after successful token refresh.");
        }
        console.log("User data re-fetched after successful refresh.");

      } catch (err) {
        // This catch block handles:
        // a) Initial fetchUser failure (e.g., no valid token, 401)
        // b) Refresh token failure
        // c) fetchUser failure after refresh
        console.error("Authentication bootstrapping failed:", err.response?.status, err.message);

        if (isMountedRef.current) {
          setUser(null); // Ensure user state is cleared on failure
        }
        clearAuthCookies(); // Clear any remaining client-side accessible cookies
        // Important: The backend's /auth/refresh-token endpoint should *already*
        // be clearing httpOnly cookies on verification failure or if the refresh token is blacklisted.
      } finally {
        if (isMountedRef.current) {
          setLoading(false); // Always set loading to false at the end
        }
      }
    };

    bootstrapAuth();
  }, [fetchUser]); // Depend on fetchUser, which is useCallback

  const login = async (email, password) => {
    try {
      // Browser automatically receives and stores httpOnly cookies from this response
      const { data } = await api.post("/auth/login", { email, password });
      const userData = data?.user;

      if (validateUserData(userData)) {
        if (isMountedRef.current) setUser(userData);
        return userData;
      } else {
        // If the login response itself doesn't contain valid user data, fetch it.
        // This is a fallback, ideally login response has complete user data.
        return await fetchUser();
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err; // Re-throw the error for the calling component to handle (e.g., display toast)
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Browser automatically receives and stores httpOnly cookies from this response
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const userData = data?.user;

      if (validateUserData(userData)) {
        if (isMountedRef.current) setUser(userData);
        return userData;
      } else {
        // Similar fallback for signup response
        return await fetchUser();
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      throw err; // Re-throw for consistency
    }
  };

  const updateProfileData = useCallback(
    async (suffix, payload) => {
      try {
        // Browser automatically sends httpOnly accessToken with these requests
        const { data } = await api.patch(`/auth/profile${suffix}`, payload);
        const updatedUser = data?.user;

        if (!updatedUser) {
          console.error("Updated user missing from response for:", suffix);
          return await fetchUser(); // Re-fetch to ensure current state is accurate
        }

        if (isMountedRef.current && validateUserData(updatedUser)) {
          setUser(updatedUser);
          return updatedUser;
        } else {
          console.warn("Invalid updated user data received:", updatedUser);
          return await fetchUser(); // Re-fetch if received data is invalid
        }
      } catch (err) {
        console.error(`Update profile ${suffix} failed:`, err.response?.status, err.response?.data || err.message);
        throw err; // Re-throw for consistent error handling
      }
    },
    [fetchUser]
  );

  const updateRole = (role) => updateProfileData("/role", { role });
  const updateInterestedSkills = (skills) =>
    updateProfileData("/interested-skills", { interestedSkills: skills });
  const updateTeachingSkills = (skills) =>
    updateProfileData("/teaching-skills", { teachingSkills: skills });
  const updateAvailability = (date, slots) =>
    updateProfileData("/availability", { date, slots });
  const updateGeneralProfile = (profileData) =>
    updateProfileData("", profileData);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        fetchUser,
        updateRole,
        updateInterestedSkills,
        updateTeachingSkills,
        updateAvailability,
        updateGeneralProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}