
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

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// Create context and hook
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Axios API instance
export const api = axios.create({
  baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
  withCredentials: true,
});

// Helper to clear auth cookies
function clearAuthCookies() {
  Cookies.remove("accessToken", { path: '/' });
  Cookies.remove("refreshToken", { path: '/' });
}

// Axios interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenExpired =
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshtoken");

    if (!isTokenExpired) return Promise.reject(error);

    originalRequest._retry = true;
    console.warn("Interceptor: Access token expired, trying to refresh...");

    try {
      await axios.post(
        `${api.defaults.baseURL}/auth/refreshtoken`,
        {},
        { withCredentials: true }
      );
      console.info("Interceptor: Token refreshed. Retrying original request...");
      return api(originalRequest);
    } catch (refreshError) {
      console.error("Interceptor: Token refresh failed:", refreshError.response?.data || refreshError.message);

      if (window.location.pathname !== "/login") {
        clearAuthCookies(); // Only clear cookies when redirecting
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Fetch user profile
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile");
      const userData = data?.user || data;
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("AuthContext: Failed to fetch user profile:", err.response?.data || err.message);
      setUser(null);
      if ([401, 403].includes(err.response?.status)) clearAuthCookies();
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🧠 Improved: Prevent race condition on unmount
  useEffect(() => {
    const tokenExists = Cookies.get("accessToken");
    if (!tokenExists) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const user = await fetchUser();
        if (!controller.signal.aborted) setUser(user);
      } catch {
        if (!controller.signal.aborted) setUser(null);
      }
    })();

    return () => controller.abort();
  }, [fetchUser]);

  // ✅ Strict response validation
  const validateUserData = (userData) => {
    return (
      userData &&
      typeof userData === "object" &&
      typeof userData.id === "string" &&
      typeof userData.name === "string" &&
      typeof userData.email === "string"
    );
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const userData = data?.user || data;

      if (!validateUserData(userData)) {
        throw new Error("Invalid user data returned from login API");
      }

      setUser(userData);
      return userData;
    } catch (err) {
      console.error("AuthContext: Login error:", err.response?.data || err.message);
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      const userData = data?.user || data;

      if (!validateUserData(userData)) {
        throw new Error("Invalid user data returned from signup API");
      }

      setUser(userData);
      return userData;
    } catch (err) {
      console.error("AuthContext: Signup error:", err.response?.data || err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      clearAuthCookies();
    } catch (err) {
      console.error("AuthContext: Logout failed:", err.response?.data || err.message);
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
