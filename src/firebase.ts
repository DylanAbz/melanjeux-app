// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "melanjeux-dev.firebaseapp.com",
  projectId: "melanjeux-dev",
  storageBucket: "melanjeux-dev.firebasestorage.app",
  messagingSenderId: "29358926396",
  appId: "1:29358926396:web:63af185c6d124829d17139"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Auth without the automatic iframe dependencies to avoid the hanging request
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});