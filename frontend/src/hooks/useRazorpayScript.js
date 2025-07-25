// src/hooks/useRazorpayScript.js or src/contexts/useRazorpayScript.js
import { useEffect, useState } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const useRazorpayScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    // Check if script already exists (e.g., if context remounts or hot reloading)
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)) {
      if (window.Razorpay) {
        setScriptLoaded(true);
      } else {
        // If script element exists but Razorpay object isn't there yet,
        // it might still be loading or failed silently. Re-attach onload listener.
        const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
        existingScript.onload = () => setScriptLoaded(true);
        existingScript.onerror = () => setScriptError(new Error("Failed to load Razorpay SDK."));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true; // Load asynchronously to not block rendering
    script.onload = () => {
      setScriptLoaded(true);
      setScriptError(null);
    };
    script.onerror = () => {
      setScriptLoaded(false);
      setScriptError(new Error("Failed to load Razorpay SDK. Please check your network."));
      alert("Failed to load payment gateway script. Please check your internet connection and try again.");
    };

    document.body.appendChild(script);

    return () => {
      // Optional: Clean up the script tag if the component unmounts
      // This is generally not needed for global SDKs like Razorpay,
      // but good practice for other dynamic scripts.
      // if (document.body.contains(script)) {
      //   document.body.removeChild(script);
      // }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return { scriptLoaded, scriptError };
};

export default useRazorpayScript;
