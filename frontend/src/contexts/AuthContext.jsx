

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refreshtoken" // Changed this line to match backend route
    ) {
      originalRequest._retry = true;
      console.log("Interceptor: Access token expired or invalid. Attempting to refresh token...");

      try {
        await axios.post(
          "https://s69-vikranth-capstone-vidyapaalam.onrender.com/auth/refreshtoken", // Changed this line to match backend route
          {},
          { withCredentials: true }
        );
        console.log("Interceptor: Token refresh successful!");

        return api(originalRequest);

      } catch (refreshError) {
        console.error("Interceptor: Token refresh failed:", refreshError.response?.data || refreshError.message);
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile");
      setUser(data);
      return data;
    } catch (err) {
      console.error("Error fetching user profile:", err.response?.data || err.message);
      setUser(null);
      if (err.response?.status === 401 || err.response?.status === 403) {
        Cookies.remove("accessToken", { path: '/' });
        Cookies.remove("refreshToken", { path: '/' });
      }
      return null;
    } finally {
      setLoading(false);
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
    const response = await api.post("/auth/login", { email, password });
    const userData = await fetchUser();
    return userData;
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    const userData = await fetchUser();
    return userData;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      Cookies.remove("accessToken", { path: '/' });
      Cookies.remove("refreshToken", { path: '/' });
    } catch (error) {
      console.error("Error logging out:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
