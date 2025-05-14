import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3400", 
  withCredentials: true,            
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err.response || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    await api.post("/auth/login", { email, password });
    await fetchUser();
  };

  const signup = async (name, email, password) => {
    await api.post("/auth/signup", { name, email, password });
    await fetchUser();
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, api, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
