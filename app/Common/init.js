import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default function() {
  const firebaseConfig = {
    apiKey: "AIzaSyAiYFeW8M5a1Uo6onR5mNu_r1Ai7tCsAhk",
    authDomain: "examencloud-9d7df.firebaseapp.com",
    projectId: "examencloud-9d7df",
    storageBucket: "examencloud-9d7df.firebasestorage.app",
    messagingSenderId: "707437361381",
    appId: "1:707437361381:web:d0e17da2b5cf4812387c0c",
    measurementId: "G-TBBR9ZVM0V"
  };
  

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const db = getFirestore(app);
  const messaging = getMessaging(app);

  return { auth, db, messaging};
}
