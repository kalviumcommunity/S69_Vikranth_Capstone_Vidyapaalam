// src/hooks/useRazorpayScript.js or src/contexts/useRazorpayScript.js
import { useEffect, useState } from 'react';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

const useRazorpayScript = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)) {
      if (window.Razorpay) {
        setScriptLoaded(true);
      } else {

        const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
        existingScript.onload = () => setScriptLoaded(true);
        existingScript.onerror = () => setScriptError(new Error("Failed to load Razorpay SDK."));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true; 
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
      
    };
  }, []); 

  return { scriptLoaded, scriptError };
};

export default useRazorpayScript;
