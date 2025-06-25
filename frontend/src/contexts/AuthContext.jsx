
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
      originalRequest.url !== "/auth/refreshtoken"
    ) {
      originalRequest._retry = true;
      console.log("Interceptor: Access token expired or invalid. Attempting to refresh token...");

      try {
        await axios.post(
          "https://s69-vikranth-capstone-vidyapaalam.onrender.com/auth/refreshtoken",
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
      // --- CRITICAL CORRECTION HERE ---
      // Check if the user data is nested under a 'user' key in the response
      if (data && data.user) {
        setUser(data.user); // Set the user state to the nested user object
        console.log("AuthContext: User fetched (nested data.user):", data.user); // DEBUG LOG
        return data.user;
      } else {
        setUser(data); // Assume data is the user object directly
        console.log("AuthContext: User fetched (direct data):", data); // DEBUG LOG
        return data;
      }
      // --- END CRITICAL CORRECTION ---
    } catch (err) {
      console.error("AuthContext: Error fetching user profile:", err.response?.data || err.message);
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
    // This part should also use the corrected fetchUser's return value for consistency
    const userData = await fetchUser(); // fetchUser now returns the correct user object
    return userData;
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    // This part should also use the corrected fetchUser's return value for consistency
    const userData = await fetchUser(); // fetchUser now returns the correct user object
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
