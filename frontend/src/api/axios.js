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


// src/api/axios.js

import axios from "axios";

import { clearAuthCookies } from "../utils/authUtils";

export const api = axios.create({
  baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
  withCredentials: true, 
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token); 
    }
  });
  failedQueue = []; 
};

api.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config; 

    const isAuthError =
      error.response?.status === 401 || error.response?.status === 403;

    if (
      !originalRequest || 
      originalRequest._retry || 
      originalRequest.url.includes("/auth/refresh-token") || 
      !isAuthError 
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject }); 
      })
        .then(() => api(originalRequest)) 
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshResponse = await axios.post(
        `${api.defaults.baseURL}/auth/refresh-token`,
        {}, 
        { withCredentials: true } 
      );

      isRefreshing = false; 
      processQueue(null, refreshResponse.data); 

      return api(originalRequest);
    } catch (refreshError) {
      console.error(
        "Token refresh failed in interceptor:",
        refreshError.response?.status,
        refreshError.response?.data || refreshError.message
      );

      isRefreshing = false; 
      processQueue(refreshError); 

      clearAuthCookies(); 
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/"; 
      }

      return Promise.reject(refreshError); 
    }
  }
);