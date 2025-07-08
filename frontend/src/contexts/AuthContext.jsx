import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { api } from "../api/axios";
import { clearAuthCookies, setAuthCookies, getAuthStatus, validateUserData } from "../utils/authUtils";
import { useToast } from "../hooks/use-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleAuthError = useCallback((error, action = "") => {
    const message = error.response?.data?.message || error.message;
    console.error(`Auth error during ${action}:`, message);
    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    });
    return null;
  }, [toast]);

  const logout = useCallback(async (redirectUrl = "/") => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout error:", err.response?.data || err.message);
    } finally {
      if (isMountedRef.current) {
        setUser(null);
        clearAuthCookies();
        if (typeof window !== "undefined" && window.location.pathname !== redirectUrl) {
          window.location.href = redirectUrl;
        }
      }
    }
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const { isAuthenticated } = getAuthStatus();
      if (!isAuthenticated) {
        if (isMountedRef.current) setUser(null);
        return null;
      }

      const { data } = await api.get("/auth/me");
      
      if (!validateUserData(data)) {
        console.warn("Invalid user data received:", data);
        await logout();
        return null;
      }

      if (isMountedRef.current) {
        setUser(data);
        return data;
      }
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        await logout();
      }
      return handleAuthError(err, "fetching user");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setInitialized(true);
      }
    }
  }, [logout, handleAuthError]);

  useEffect(() => {
    const { isAuthenticated } = getAuthStatus();
    if (isAuthenticated) {
      fetchUser();
    } else {
      setLoading(false);
      setInitialized(true);
    }
  }, [fetchUser]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      
      if (!data.user || !validateUserData(data.user)) {
        throw new Error("Invalid response from server");
      }

      if (isMountedRef.current) {
        setUser(data.user);
      }
      
      return data.user;
    } catch (err) {
      return handleAuthError(err, "login");
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      
      if (!data.user || !validateUserData(data.user)) {
        throw new Error("Invalid response from server");
      }

      if (isMountedRef.current) {
        setUser(data.user);
      }
      
      return data.user;
    } catch (err) {
      return handleAuthError(err, "signup");
    }
  };

  const updateProfileData = async (endpoint, updateData) => {
    try {
      const { data } = await api.patch(`/auth/profile${endpoint}`, updateData);
      
      if (!validateUserData(data.user)) {
        throw new Error("Invalid response from server");
      }

      if (isMountedRef.current) {
        setUser(data.user);
      }
      
      toast({
        title: "Success",
        description: data.message || "Profile updated successfully",
      });
      
      return data.user;
    } catch (err) {
      return handleAuthError(err, "updating profile");
    }
  };

  const updateRole = (role) => updateProfileData("/role", { role });
  const updateInterestedSkills = (skills) => updateProfileData("/interested-skills", { interestedSkills: skills });
  const updateTeachingSkills = (skills) => updateProfileData("/teaching-skills", { teachingSkills: skills });
  const updateAvailability = (date, slots) => updateProfileData("/availability", { date, slots });
  const updateGeneralProfile = (profileData) => updateProfileData("", profileData);

  const getGoogleCalendarBusyTimes = async (date) => {
    try {
      const response = await api.get(`/auth/calendar/busy-times?date=${date}`);
      return response.data.busyTimes;
    } catch (error) {
      console.error("Error fetching busy times:", error.response?.data || error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initialized,
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
