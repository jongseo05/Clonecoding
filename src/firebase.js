// src/firebase.js - 순환 의존성 방지 버전
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAhZUWLX-MwcZZ7ExiyYSCZL-gUrorxaDk",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 초기화
const auth = getAuth(app);
const firestore = getFirestore(app);
const db = getDatabase(app);

// 인증 상태 지속성 설정
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Firebase 인증 지속성 설정 완료: localStorage");
    })
    .catch((error) => {
        console.error("인증 지속성 설정 오류:", error);
    });

// 모듈 내보내기
export { auth, firestore, db };