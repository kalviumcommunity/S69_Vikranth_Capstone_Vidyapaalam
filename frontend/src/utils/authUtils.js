import Cookies from "js-cookie";

const COOKIE_DOMAIN = window.location.hostname === 'localhost' 
  ? 'localhost'
  : '.onrender.com';

export const cookieOptions = {
  path: '/',
  secure: true,
  sameSite: 'Strict',
  domain: COOKIE_DOMAIN
};

export const clearAuthCookies = () => {
  Cookies.remove("accessToken", cookieOptions);
  Cookies.remove("refreshToken", cookieOptions);
  localStorage.removeItem('isAuthenticated');
};

export const setAuthCookies = (accessToken, refreshToken) => {
  if (accessToken) {
    Cookies.set("accessToken", accessToken, cookieOptions);
  }
  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken, cookieOptions);
  }
  localStorage.setItem('isAuthenticated', 'true');
};

export const getAuthStatus = () => {
  const hasAccessToken = !!Cookies.get("accessToken");
  const hasRefreshToken = !!Cookies.get("refreshToken");
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  return {
    isAuthenticated: isAuthenticated && (hasAccessToken || hasRefreshToken),
    hasAccessToken,
    hasRefreshToken
  };
};

export const validateUserData = (userData) => {
  return (
    userData &&
    typeof userData === "object" &&
    userData.id != null &&
    typeof userData.name === "string" &&
    typeof userData.email === "string" &&
    (userData.googleCalendar === undefined || typeof userData.googleCalendar === 'object') &&
    (userData.availability === undefined || Array.isArray(userData.availability)) &&
    (userData.teacherOnboardingComplete === undefined || typeof userData.teacherOnboardingComplete === 'boolean')
  );
};