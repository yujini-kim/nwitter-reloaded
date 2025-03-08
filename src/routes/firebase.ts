import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXmZkGo4JjzvwyL7murtRpwd-W-8YaAUA",
  authDomain: "nwitter-reloaded-ab67e.firebaseapp.com",
  projectId: "nwitter-reloaded-ab67e",
  storageBucket: "nwitter-reloaded-ab67e.firebasestorage.app",
  messagingSenderId: "73404862175",
  appId: "1:73404862175:web:337495f32a8bd1508a236a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
