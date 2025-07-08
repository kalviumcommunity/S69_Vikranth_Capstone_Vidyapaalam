


// // src/components/GoogleSignInButton.jsx

// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const GoogleSignInButton = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

//   const handleGoogleLogin = () => {
//     window.location.href = `${backendUrl}/auth/google`; // Initial redirect to start auth
//   };

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const code = params.get('code');
//     const error = params.get('error');

//     if (code) {
//       axios
//         .get(`${backendUrl}/auth/calendar/callback?code=${code}`, {
//           withCredentials: true,
//         })
//         .then((res) => {
//           const { redirectTo } = res.data;
//           navigate(redirectTo);
//         })
//         .catch((err) => {
//           console.error("Google callback error", err);
//           alert("Google login failed");
//         });
//     } else if (error) {
//       alert("Google login failed");
//     }
//   }, [location.search]);

//   return (
//     <button
//       onClick={handleGoogleLogin}
//       className="w-full px-6 py-3 rounded-2xl font-medium text-sm sm:text-base
//         text-gray-700 bg-white border border-gray-300 shadow-md
//         hover:bg-gray-50 hover:shadow-lg active:scale-[0.98]
//         transition-all duration-200 ease-in-out
//         flex items-center justify-center gap-3
//         focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
//     >
//       <img
//         src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//         alt="Google logo"
//         className="h-5 w-5"
//       />
//       Continue with Google
//     </button>
//   );
// };

// export default GoogleSignInButton;
