// // src/components/GoogleSignInButton.jsx

// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// // It now accepts onSuccess and onError as props
// const GoogleSignInButton = ({ onSuccess, onError }) => {
//   const navigate = useNavigate(); // Still needed for URL cleanup
//   const location = useLocation();

// const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
//   // Function to initiate Google OAuth login via backend
//   const handleGoogleLogin = () => {
//     window.location.href = `${backendUrl}/auth/google`;
//   };

//   // Effect to handle the redirect from the backend after Google OAuth
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const googleAuthSuccess = params.get('googleAuthSuccess');
//     const isNewUser = params.get('isNewUser');
//     const error = params.get('error');

//     // Clean up the URL parameters immediately after reading them
//     // This prevents the effect from re-firing unnecessarily and keeps the URL clean
//     if (googleAuthSuccess || error) {
//       navigate(location.pathname, { replace: true });
//     }

//     if (googleAuthSuccess === 'true') {
//       // Call the success callback provided by the parent
//       if (onSuccess) {
//         onSuccess({ isNewUser: isNewUser === 'true' });
//       }
//     } else if (googleAuthSuccess === 'false' && error) {
//       // Call the error callback provided by the parent
//       if (onError) {
//         onError(decodeURIComponent(error));
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [location.search, onSuccess, onError, navigate]); // Add onSuccess, onError, navigate to dependencies

//   return (
//     <button
//   onClick={handleGoogleLogin}
//   className="
//     w-full px-6 py-3 rounded-2xl font-medium text-sm sm:text-base
//     text-gray-700 bg-white border border-gray-300 shadow-md
//     hover:bg-gray-50 hover:shadow-lg active:scale-[0.98]
//     transition-all duration-200 ease-in-out
//     flex items-center justify-center gap-3
//     focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
//   "
// >
//   <img
//     src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//     alt="Google logo"
//     className="h-5 w-5"
//   />
//   Continue with Google
// </button>

//   );
// };

// export default GoogleSignInButton;


// src/components/GoogleSignInButton.jsx

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleSignInButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/auth/google`; // Initial redirect to start auth
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const error = params.get('error');

    if (code) {
      axios
        .get(`${backendUrl}/auth/calendar/callback?code=${code}`, {
          withCredentials: true,
        })
        .then((res) => {
          const { redirectTo } = res.data;
          navigate(redirectTo);
        })
        .catch((err) => {
          console.error("Google callback error", err);
          alert("Google login failed");
        });
    } else if (error) {
      alert("Google login failed");
    }
  }, [location.search]);

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full px-6 py-3 rounded-2xl font-medium text-sm sm:text-base
        text-gray-700 bg-white border border-gray-300 shadow-md
        hover:bg-gray-50 hover:shadow-lg active:scale-[0.98]
        transition-all duration-200 ease-in-out
        flex items-center justify-center gap-3
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google logo"
        className="h-5 w-5"
      />
      Continue with Google
    </button>
  );
};

export default GoogleSignInButton;
