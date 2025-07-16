import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginPage = document.getElementById("loginPage");
  const signupPage = document.getElementById("signupPage");
  const showLogin = document.getElementById("showLogin");
  const showSignup = document.getElementById("showSignup");
  const mainContent = document.getElementById("mainContent");
  const homePageContent = document.getElementById("homePageContent");

  loginPage.style.display = "none";
  signupPage.style.display = "none";
  mainContent.style.display = "none";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      mainContent.style.display = "block";
      loginPage.style.display = "none";
      signupPage.style.display = "none";

      document.querySelectorAll(".content-page").forEach((section) => {
        section.classList.add("hidden-page");
      });
      homePageContent.classList.remove("hidden-page");
    } else {
      loginPage.style.display = "block";
      signupPage.style.display = "none";
      mainContent.style.display = "none";
      homePageContent.classList.add("hidden-page");
    }
  });

  showSignup.addEventListener("click", (e) => {
    e.preventDefault();
    loginPage.classList.remove("active");
    loginPage.style.display = "none";

    signupPage.classList.add("active");
    signupPage.style.display = "block";

    homePageContent.classList.add("hidden-page");
  });

  showLogin.addEventListener("click", (e) => {
    e.preventDefault();
    signupPage.classList.remove("active");
    signupPage.style.display = "none";

    loginPage.classList.add("active");
    loginPage.style.display = "block";

    homePageContent.classList.add("hidden-page");
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Sign-up successful! Please log in.");
        signupPage.classList.remove("active");
        loginPage.classList.add("active");
        signupPage.style.display = "none";
        loginPage.style.display = "block";
        homePageContent.classList.add("hidden-page");
      })
      .catch((error) => {
        alert("Signup error: " + error.message);
      });
  });
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Logged in:", userCredential.user);

      document.getElementById('loginPage').classList.remove('active');
      document.getElementById('signupPage').classList.remove('active');

      document.getElementById('mainContent').classList.remove('hidden-content');

      document.querySelectorAll('.content-page').forEach(section => {
        section.classList.add('hidden-page');
      });
      document.getElementById('homePageContent').classList.remove('hidden-page');
    })
    .catch((error) => {
      console.error("Login error:", error.message);
      alert("Login failed: " + error.message);
    });
});

logoutButton.addEventListener("click", () => {
  signOut(auth).then(() => {
    document.getElementById("mainContent").classList.add("hidden-content");
    document.getElementById("loginPage").classList.add("active");
    document.getElementById("signupPage").classList.remove("active");
    document.getElementById("homePageContent").classList.add("hidden-page");
    document.getElementById("loginForm").reset();
  }).catch((error) => {
    alert("Error signing out: " + error.message);
  });
});
