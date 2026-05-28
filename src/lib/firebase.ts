import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDH4GB1kc3YN957_qnaztMW-7t0kEKwp7c",
  authDomain: "ak-fitness-d8d77.firebaseapp.com",
  projectId: "ak-fitness-d8d77",
  storageBucket: "ak-fitness-d8d77.firebasestorage.app",
  messagingSenderId: "173696523297",
  appId: "1:173696523297:web:2945875b3ded4f3f935760",
  measurementId: "G-XSX066GBL9"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
