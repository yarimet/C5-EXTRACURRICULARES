import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyong9ZOgCQebPoP6GvNPf9ertyvY-VgY",
  authDomain: "c5-actividades.firebaseapp.com",
  projectId: "c5-actividades",
  storageBucket: "c5-actividades.firebasestorage.app",
  messagingSenderId: "435720517566",
  appId: "1:435720517566:web:057301d966eb29afa1ebef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);