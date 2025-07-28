// authh.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpkPV1xptnhF0g5pJkQjC3rEQjjrCzPdE",
  authDomain: "event-manager-data.firebaseapp.com",
  projectId: "event-manager-data",
  storageBucket: "event-manager-data.firebasestorage.app",
  messagingSenderId: "349245880380",
  appId: "1:349245880380:web:72f27dda0a993ae3a76b39",
  measurementId: "G-R1HKCCHX4V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Preloader handling
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.remove("auth-loading");
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.display = "none";
    }
  }, 500);
});

// Auth state change
onAuthStateChanged(auth, async (user) => {
  const loginPage = document.getElementById('loginPage');
  const signupPage = document.getElementById('signupPage');
  const mainContent = document.getElementById('mainContent');
  const homePageContent = document.getElementById('homePageContent');

  if (!loginPage || !signupPage || !mainContent) {
    console.error("Auth elements (loginPage, signupPage, mainContent) not found.");
    return;
  }

  if (user) {
    console.log("User logged in:", user.email);
    loginPage.classList.remove('active');
    loginPage.classList.add('hidden');
    signupPage.classList.remove('active');
    signupPage.classList.add('hidden');
    mainContent.classList.remove('hidden-content');
    if (homePageContent) {
      document.querySelectorAll('.content-page').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden-page');
      });
      homePageContent.classList.add('active');
      homePageContent.classList.remove('hidden-page');
    }
  } else {
    console.log("User logged out.");
    loginPage.classList.add('active');
    loginPage.classList.remove('hidden');
    signupPage.classList.remove('active');
    signupPage.classList.add('hidden');
    mainContent.classList.add('hidden-content');
  }
});

// Page switch
function showPage(pageToShowId, pageToHideId) {
  const pageToShow = document.getElementById(pageToShowId);
  const pageToHide = document.getElementById(pageToHideId);

  if (pageToShow && pageToHide) {
    pageToHide.classList.remove('active');
    pageToHide.classList.add('hidden');
    pageToShow.classList.remove('hidden');
    pageToShow.classList.add('active');
  } else {
    console.error(`Could not find pages: ${pageToShowId}, ${pageToHideId}`);
  }
}

// Page switch listeners
const showSignupLink = document.getElementById('showSignupLink');
const showLoginLink = document.getElementById('showLoginLink');

if (showSignupLink) {
  showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('signupPage', 'loginPage');
  });
}

if (showLoginLink) {
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showPage('loginPage', 'signupPage');
  });
}

// Login Form
// Login Form
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.loginEmail.value;
    const password = loginForm.loginPassword.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully!");
      if (window.showAlert) window.showAlert("Logged in successfully!");

      // ✅ Immediately show the main content UI
      const loginPage = document.getElementById('loginPage');
      const signupPage = document.getElementById('signupPage');
      const mainContent = document.getElementById('mainContent');
      const homePageContent = document.getElementById('homePageContent');

      if (loginPage && signupPage && mainContent && homePageContent) {
        loginPage.classList.remove('active');
        loginPage.classList.add('hidden');
        signupPage.classList.remove('active');
        signupPage.classList.add('hidden');
        mainContent.classList.remove('hidden-content');

        document.querySelectorAll('.content-page').forEach(section => {
          section.classList.remove('active');
          section.classList.add('hidden-page');
        });

        homePageContent.classList.add('active');
        homePageContent.classList.remove('hidden-page');
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      if (window.showAlert) window.showAlert(`Login failed: ${error.message}`);
    }
  });
}

const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const birthdate = document.getElementById('signupBirthdate').value;
    const phone = document.getElementById('signupPhone').value;

    if (!email || !password || !birthdate || !phone) {
      if (window.showAlert) window.showAlert("Please fill in all fields.");
      else alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      if (window.showAlert) window.showAlert("Password should be at least 6 characters.");
      else alert("Password should be at least 6 characters.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        birthdate,
        phone,
        name: "New User",
        school: "N/A",
        address: "N/A",
        yearLevel: "N/A",
        contact: phone
      });

      console.log("User signed up and profile created:", user.email);
      if (window.showAlert) window.showAlert("Account created successfully! You are now logged in.");
            } catch (error) {
      console.error("Sign-up failed:", error);

      const errorCode = error.code;

      
      if (errorCode === "auth/email-already-in-use") {
        alert("Email is already in use. Please try another email.");
      } else if (errorCode === "auth/invalid-email") {
        alert("Invalid email format.");
      } else if (errorCode === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        
        alert("Sign-up failed: " + error.message);
      }
    }


  });
}


//Logout handling
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      if (window.showAlert) {
        window.showAlert("Logged out successfully!");
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
      if (window.showAlert) {
        window.showAlert("Error signing out: " + error.message);
      }
    }
  });
} else {
  console.warn("Logout button not found in the DOM.");
}
// forgot password

document.getElementById("forgotPasswordLink").addEventListener("click", (e) => {
  e.preventDefault();

  const email = prompt("Please enter your email to reset your password:");

  if (email) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("✅ Password reset email sent! Please check your inbox or Spam Mail.");
      })
      .catch((error) => {
        alert("❌ Error: " + error.message);
      });
  }
});