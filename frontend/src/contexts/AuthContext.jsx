
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


import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import Cookies from "js-cookie";
import { api } from "../api/axios";
import { clearAuthCookies, validateUserData } from "../utils/authUtils";

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      const { data } = await api.get("/auth/profile");
      const userData = data;

      if (isMountedRef.current) {
        if (validateUserData(userData)) {
          setUser(userData);
          return userData;
        } else {
          console.warn("Fetched user data is invalid or incomplete:", userData);
          setUser(null);
          clearAuthCookies();
          return null;
        }
      }
      return null;
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to fetch user:", err.response?.data || err.message);
        setUser(null);
      }
      if ([401, 403].includes(err.response?.status)) clearAuthCookies();
      return null;
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const tokenExists = Cookies.get("accessToken");

    if (tokenExists) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const userData = data?.user;

      if (validateUserData(userData)) {
        if (isMountedRef.current) setUser(userData);
        return userData;
      } else {
        return await fetchUser();
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      const userData = data?.user;

      if (validateUserData(userData)) {
        if (isMountedRef.current) setUser(userData);
        return userData;
      } else {
        return await fetchUser();
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      if (isMountedRef.current) setUser(null);
      clearAuthCookies();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      throw err;
    }
  };

  const updateProfileData = useCallback(async (endpointSuffix, dataToUpdate) => {
    try {
      // CORRECTED: Removed /api prefix
      const { data } = await api.patch(`/auth/profile${endpointSuffix}`, dataToUpdate);
      const updatedUser = data?.user;

      if (isMountedRef.current && validateUserData(updatedUser)) {
        setUser(updatedUser);
        return updatedUser;
      } else {
        console.warn("Updated user data is invalid or incomplete after patch:", updatedUser);
        return await fetchUser();
      }
    } catch (err) {
      console.error(`Error updating profile data for ${endpointSuffix}:`, err.response?.data || err.message);
      throw err;
    }
  }, [fetchUser]);

  const updateRole = (role) => updateProfileData('/profile/role', { role });
  const updateInterestedSkills = (skills) => updateProfileData('/profile/interested-skills', { interestedSkills: skills });
  const updateTeachingSkills = (skills) => updateProfileData('/profile/teaching-skills', { teachingSkills: skills });
  const updateAvailability = (date, slots) => updateProfileData('/profile/availability', { date, slots });
  const updateGeneralProfile = (profileData) => updateProfileData('', profileData);

  const getGoogleCalendarBusyTimes = async (date) => {
    try {
      const response = await api.get(`/auth/calendar/busy-times?date=${date}`);
      return response.data.busyTimes;
    } catch (error) {
      console.error('Error fetching Google Calendar busy times:', error.response?.data || error.message);
      throw error;
    }
  };

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
        getGoogleCalendarBusyTimes,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
