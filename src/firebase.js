import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAhZUWLX-MwcZZ7ExiyYSCZL-gUrorxaDk",
    authDomain: "afac2025-02.firebaseapp.com",
    databaseURL: "https://afac2025-02-default-rtdb.firebaseio.com",
    projectId: "afac2025-02",
    storageBucket: "afac2025-02.firebasestorage.app",
    messagingSenderId: "520958268952",
    appId: "1:520958268952:web:a786eb49c8d8db144e156d",
    measurementId: "G-3STD4EKMF8"
};

// Firebase 초기화 (중복 실행 방지)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // 브라우저 환경에서만 실행
const firebase = initializeApp(firebaseConfig);
const fireStore = getFirestore(firebase);

export { app, auth, db, analytics, fireStore};
