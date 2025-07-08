import Cookies from "js-cookie";

export const clearAuthCookies = () => {
  Cookies.remove("accessToken", { path: '/' });
  Cookies.remove("refreshToken", { path: '/' });
  
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