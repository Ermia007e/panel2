
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import getStorage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC49u1LMgsmAMVc9FCX6k7AYWcIDAudSG0",
  authDomain: "bahracademy-915bf.firebaseapp.com",
  projectId: "bahracademy-915bf",
  storageBucket: "bahracademy-915bf.firebasestorage.app",
  messagingSenderId: "192755574038",
  appId: "1:192755574038:web:13582647da50bb29ae1c37",
  measurementId: "G-40BKENTWZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // Initialize and export storage

// You might also export the app instance if needed elsewhere
// export default app;