
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

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const api = axios.create({
  baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
  withCredentials: true,
});

function clearAuthCookies() {
  Cookies.remove("accessToken", { path: '/' });
  Cookies.remove("refreshToken", { path: '/' });
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      originalRequest.url !== `${api.defaults.baseURL}/auth/refreshtoken`
    ) {
      originalRequest._retry = true;
      console.log("Interceptor: Access token expired or invalid. Attempting to refresh token...");

      try {
        await axios.post(
          `${api.defaults.baseURL}/auth/refreshtoken`,
          {},
          { withCredentials: true }
        );
        console.log("Interceptor: Token refresh successful!");
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Interceptor: Token refresh failed:", refreshError.response?.data || refreshError.message);
        clearAuthCookies();

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
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
      const userData = data?.user || data;
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("AuthContext: Error fetching user profile:", err.response?.data || err.message);
      setUser(null);
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearAuthCookies();
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const tokenExists = Cookies.get("accessToken");
    if (!tokenExists) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const loadUser = async () => {
      if (isMounted) await fetchUser();
    };
    loadUser();
    return () => { isMounted = false };
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data?.user || response.data;
      if (userData?.email && userData?.id && userData?.name) {
        setUser(userData);
        return userData;
      } else {
        return await fetchUser();
      }
    } catch (error) {
      console.error("AuthContext: Login failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post("/auth/signup", { name, email, password });
      const userData = response.data?.user || response.data;
      if (userData?.email && userData?.id && userData?.name) {
        setUser(userData);
        return userData;
      } else {
        return await fetchUser();
      }
    } catch (error) {
      console.error("AuthContext: Signup failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      clearAuthCookies();
    } catch (error) {
      console.error("AuthContext: Logout failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
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
