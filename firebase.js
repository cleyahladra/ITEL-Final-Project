// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7U3l7BIMyb1juwk4O8Jbi6EKlc5t-tHY",
  authDomain: "final-project-group-5-d14ec.firebaseapp.com",
  projectId: "final-project-group-5-d14ec",
  storageBucket: "final-project-group-5-d14ec.firebasestorage.app",
  messagingSenderId: "100467436361",
  appId: "1:100467436361:web:03986f0bbca9dc36a84898",
  measurementId: "G-NMXS5E7YD8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
