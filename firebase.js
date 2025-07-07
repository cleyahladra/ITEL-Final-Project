// firebase.js - Initializes Firebase and exports services

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const App = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = typeof __app_id !== 'undefined' ? __app_id : firebaseConfig.appId;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


export {
    auth,
    db,
    appId, // Export appId for use in Firestore paths
    initialAuthToken, // Export initialAuthToken for Canvas environment
    // Export specific auth functions needed in main.js
    signInAnonymously,
    signInWithCustomToken,
    onAuthStateChanged
};
