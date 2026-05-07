// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkCBSDTOtGkfAxSVajaur0yw9lwbotoRs",
  authDomain: "partnerauth-5ecd3.firebaseapp.com",
  projectId: "partnerauth-5ecd3",
  storageBucket: "partnerauth-5ecd3.firebasestorage.app",
  messagingSenderId: "314934230802",
  appId: "1:314934230802:web:8719e140678cb951a8fdcb",
  measurementId: "G-FY3LQVYDZP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);