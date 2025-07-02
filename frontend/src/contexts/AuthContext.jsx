
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
import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Axios instance
export const api = axios.create({
  baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
  withCredentials: true,
});

// Utility: Clear cookies
const clearAuthCookies = () => {
  Cookies.remove("accessToken", { path: '/' });
  Cookies.remove("refreshToken", { path: '/' });
};

// Improved interceptor with full failure handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldRefresh =
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshtoken");

    if (!shouldRefresh) return Promise.reject(error);

    originalRequest._retry = true;

    try {
      await axios.post(`${api.defaults.baseURL}/auth/refreshtoken`, {}, { withCredentials: true });
      return api(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);

      clearAuthCookies();

      // --- CRITICAL FIX: Redirect to homepage (/) instead of /login ---
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/"; // Redirect to the homepage
      }
      // --- END CRITICAL FIX ---

      return Promise.reject(refreshError);
    }
  }
);

// Relaxed validation while ensuring core structure
const validateUserData = (userData) => {
  return (
    userData &&
    typeof userData === "object" &&
    userData.id != null &&
    typeof userData.name === "string" &&
    typeof userData.email === "string"
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  // Cleanup effect for isMountedRef
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      if (isMountedRef.current) setLoading(true);
      const { data } = await api.get("/auth/profile");
      const userData = data?.user || data;
      if (isMountedRef.current) setUser(userData);
      return userData;
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

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const userData = data?.user || data;

      if (validateUserData(userData)) {
        setUser(userData);
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
      const { data } = await api.post("/auth/signup", { name, email, password });
      const userData = data?.user || data;

      if (validateUserData(userData)) {
        setUser(userData);
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
      setUser(null);
      clearAuthCookies();
      // --- CRITICAL FIX: Redirect to homepage (/) after logout ---
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/"; // Redirect to the homepage
      }
      // --- END CRITICAL FIX ---
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      throw err;
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
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
