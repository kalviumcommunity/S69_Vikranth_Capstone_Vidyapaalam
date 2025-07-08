import axios from "axios";
import Cookies from "js-cookie";
import { clearAuthCookies } from "../utils/authUtils"; 

export const api = axios.create({
  baseURL: "https://s69-vikranth-capstone-vidyapaalam.onrender.com",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const shouldRefresh =
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token");

    if (!shouldRefresh) return Promise.reject(error);

    originalRequest._retry = true;

    try {
      await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, {}, { withCredentials: true });
      return api(originalRequest); 
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);

      clearAuthCookies();

      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }

      return Promise.reject(refreshError);
    }
  }
);
