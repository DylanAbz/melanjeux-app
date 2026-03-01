// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiAPO3d_n_xIljqOaACZ3meQKANueyStc",
  authDomain: "melanjeux-dev.firebaseapp.com",
  projectId: "melanjeux-dev",
  storageBucket: "melanjeux-dev.firebasestorage.app",
  messagingSenderId: "29358926396",
  appId: "1:29358926396:web:63af185c6d124829d17139"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);