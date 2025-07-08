// import axios from "axios";
// import Cookies from "js-cookie";
// import { clearAuthCookies } from "../utils/authUtils"; 

// export const api = axios.create({
//   baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     const shouldRefresh =
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/refresh-token");

//     if (!shouldRefresh) return Promise.reject(error);

//     originalRequest._retry = true;

//     try {
//       await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
//       return api(originalRequest); 
//     } catch (refreshError) {
//       console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);

//       clearAuthCookies();

//       if (typeof window !== "undefined" && window.location.pathname !== "/") {
//         window.location.href = "/";
//       }

//       return Promise.reject(refreshError);
//     }
//   }
// );


import axios from "axios";
import { clearAuthCookies } from "../utils/authUtils";

const BASE_URL = "https://s69-vikranth-capstone-vidyapaalam.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      console.warn("Original request is undefined in axios interceptor", error);
      return Promise.reject(error);
    }

    // If the error is not 401 or it's already a refresh token request, reject immediately
    if (error.response?.status !== 401 || originalRequest.url === '/auth/refresh-token') {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post(`${BASE_URL}/auth/refresh-token`, {}, {
        withCredentials: true,
      });
      
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthCookies();
      
      // Only redirect if we're not already on the home/signin page
      if (typeof window !== "undefined" && 
          !window.location.pathname.match(/^\/(|signin|signup)$/)) {
        window.location.href = "/signin";
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);