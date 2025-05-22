import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // or getDatabase if using Realtime DB

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Running in:", import.meta.env.VITE_ENV_MODE);

const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);

// Firestore (or Realtime DB)
const db = getFirestore(app);
// const db = getDatabase(app); // if you're using Realtime DB

// Ensure we're signed in anonymously once, safely
let authReady = new Promise((resolve, reject) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Already signed in:", user.uid);
      resolve(user);
    } else {
      signInAnonymously(auth)
        .then((result) => {
          console.log("Signed in anonymously:", result.user.uid);
          resolve(result.user);
        })
        .catch((error) => {
          console.error("Anonymous sign-in failed:", error);
          reject(error);
        });
    }
  });
});

// USAGE IN COMPONENT OR UTILITY FILE
// --------------------------------------------------------
// import { authReady, db } from "./firebase";

// async function loadUserData() {
//   const user = await authReady;
//   console.log("Do something with:", user.uid);
//   // Use db to read/write to Firestore with this UID
// }

export { auth, db, authReady };
