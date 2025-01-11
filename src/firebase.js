import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log("API Key:", process.env.REACT_APP_FIREBASE_API_KEY);

const firebaseConfig = {
    apiKey: "AIzaSyAhZUWLX-MwcZZ7ExiyYSCZL-gUrorxaDk",
    authDomain: "afac2025-02.firebaseapp.com",
    projectId: "afac2025-02",
    storageBucket: "afac2025-02.firebasestorage.app",
    messagingSenderId: "520958268952",
    appId: "1:520958268952:web:a786eb49c8d8db144e156d",
    measurementId: "G-3STD4EKMF8"
};

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);




