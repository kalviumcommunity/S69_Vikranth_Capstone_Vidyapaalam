
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
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import Cookies from "js-cookie"; 
import { api } from "../api/axios";
import { clearAuthCookies, validateUserData } from "../utils/authUtils";

const AuthContext = createContext();
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

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      if (isMountedRef.current) setUser(null);
      clearAuthCookies();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  };

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      // CORRECTED: Changed endpoint from /auth/me to /auth/profile
      const { data } = await api.get("/auth/profile");
      
      if (!validateUserData(data)) {
        console.warn("Invalid user data received from /auth/profile:", data);
        if (isMountedRef.current) {
          setUser(null);
          clearAuthCookies();
        }
        return null;
      }

      if (isMountedRef.current) {
        setUser(data);
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch user from /auth/profile:", err.response?.data || err.message);
      if (isMountedRef.current) {
        setUser(null);
        if ([401, 403].includes(err.response?.status)) clearAuthCookies();
      }
      return null;
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
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

  const updateProfileData = useCallback(async (suffix, payload) => {
    try {
      const { data } = await api.patch(`/auth/profile${suffix}`, payload);
      const updatedUser = data?.user;

      if (!updatedUser) {
        console.error("Updated user data missing from response for", suffix);
        return await fetchUser();
      }

      if (isMountedRef.current && validateUserData(updatedUser)) {
        setUser(updatedUser);
        return updatedUser;
      } else {
        console.warn("Invalid updated user:", updatedUser);
        return await fetchUser();
      }
    } catch (err) {
      console.error(`Update profile ${suffix} failed:`, err.response?.data || err.message);
      throw err; 
    }
  }, [fetchUser]);

  const updateRole = (role) => updateProfileData("/role", { role });
  const updateInterestedSkills = (skills) => updateProfileData("/interested-skills", { interestedSkills: skills });
  const updateTeachingSkills = (skills) => updateProfileData("/teaching-skills", { teachingSkills: skills });
  const updateAvailability = (date, slots) => updateProfileData("/availability", { date, slots });
  const updateGeneralProfile = (profileData) => updateProfileData("", profileData);


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

