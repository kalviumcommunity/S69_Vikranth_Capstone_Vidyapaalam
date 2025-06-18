// src/components/GoogleSignInButton.jsx

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// It now accepts onSuccess and onError as props
const GoogleSignInButton = ({ onSuccess, onError }) => {
  const navigate = useNavigate(); // Still needed for URL cleanup
  const location = useLocation();

const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
  // Function to initiate Google OAuth login via backend
  const handleGoogleLogin = () => {
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  // Effect to handle the redirect from the backend after Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleAuthSuccess = params.get('googleAuthSuccess');
    const isNewUser = params.get('isNewUser');
    const error = params.get('error');

    // Clean up the URL parameters immediately after reading them
    // This prevents the effect from re-firing unnecessarily and keeps the URL clean
    if (googleAuthSuccess || error) {
      navigate(location.pathname, { replace: true });
    }

    if (googleAuthSuccess === 'true') {
      // Call the success callback provided by the parent
      if (onSuccess) {
        onSuccess({ isNewUser: isNewUser === 'true' });
      }
    } else if (googleAuthSuccess === 'false' && error) {
      // Call the error callback provided by the parent
      if (onError) {
        onError(decodeURIComponent(error));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, onSuccess, onError, navigate]); // Add onSuccess, onError, navigate to dependencies

  return (
    <button
      onClick={handleGoogleLogin}
      className="
        w-full px-5 py-2.5 rounded-md text-white font-semibold text-base
        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        flex items-center justify-center gap-3
        transition duration-200 ease-in-out
      "
    >
      <img
        src="https://www.gstatic.com/images/icons/material/system/2x/search_white_24dp.png"
        alt="Google logo"
        className="h-5 w-5"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;