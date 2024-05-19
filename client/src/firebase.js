// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-3c86b.firebaseapp.com",
  projectId: "mern-auth-3c86b",
  storageBucket: "mern-auth-3c86b.appspot.com",
  messagingSenderId: "184579873359",
  appId: "1:184579873359:web:572a290fb62d5fcb85683a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);