// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCk_2pQSj7ahu8a6mqREqDCEIMkAiSVbkQ",
  authDomain: "vidyapaalam.firebaseapp.com",
  projectId: "vidyapaalam",
  storageBucket: "vidyapaalam.firebasestorage.app",
  messagingSenderId: "865053526125",
  appId: "1:865053526125:web:7fbbf0a8b0d01dabad1764",
  measurementId: "G-7X59PKEMFC"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 


