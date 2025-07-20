// authh.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Firebase configuration (ensure this matches your actual config)
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
const db = getFirestore(app); // Initialize Firestore

// Preloader handling
window.addEventListener("load", () => {
    // Delay hiding the preloader to ensure everything is rendered
    setTimeout(() => {
        document.body.classList.remove("auth-loading");
        const preloader = document.getElementById("preloader");
        if (preloader) {
            preloader.style.display = "none";
        }
    }, 500); // 500ms delay for preloader
});

// Authentication state change listener
onAuthStateChanged(auth, async (user) => {
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainContent = document.getElementById('mainContent');
    const homePageContent = document.getElementById('homePageContent'); // Assuming you have a homePageContent
    
    if (!loginPage || !signupPage || !mainContent) {
        console.error("Auth elements (loginPage, signupPage, mainContent) not found on page.");
        return;
    }

    if (user) {
        // User is signed in (logged in)
        console.log("User logged in:", user.email);
        // Hide authentication pages
        loginPage.classList.remove('active');
        loginPage.classList.add('hidden');
        signupPage.classList.remove('active');
        signupPage.classList.add('hidden');
        
        // Show main content and home page
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
        // User is signed out (logged out)
        console.log("User logged out.");
        // Show login page by default, hide signup and main content
        loginPage.classList.add('active');
        loginPage.classList.remove('hidden');
        signupPage.classList.remove('active'); // Ensure signup is hidden initially
        signupPage.classList.add('hidden');
        mainContent.classList.add('hidden-content'); // Hide main content
    }
});

// Get DOM elements for authentication forms and toggles
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupLink = document.getElementById('showSignupLink');
const showLoginLink = document.getElementById('showLoginLink');

// Function to switch between login and signup pages
function showPage(pageToShowId, pageToHideId) {
    const pageToShow = document.getElementById(pageToShowId);
    const pageToHide = document.getElementById(pageToHideId);

    if (pageToShow && pageToHide) {
        pageToHide.classList.remove('active');
        pageToHide.classList.add('hidden');
        pageToShow.classList.remove('hidden');
        pageToShow.classList.add('active');
    } else {
        console.error(`Error: Could not find pages for switching. Show: ${pageToShowId}, Hide: ${pageToHideId}`);
    }
}

// Event listener for "Sign up now." link to show signup page
if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        showPage('signupPage', 'loginPage');
    });
}

// Event listener for "Log In" link to show login page
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        showPage('loginPage', 'signupPage');
    });
}

// Handle Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = loginForm.loginEmail.value;
        const password = loginForm.loginPassword.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully!");
            // onAuthStateChanged will handle page redirection
            if (window.showAlert) {
                window.showAlert("Logged in successfully!");
            }
        } catch (error) {
            console.error("Login failed:", error.message);
            if (window.showAlert) {
                window.showAlert(`Login failed: ${error.message}`);
            }
        }
    });
}

// Handle Signup Form Submission
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission

        const email = signupForm.signupEmail.value;
        const password = signupForm.signupPassword.value;
        const birthdate = signupForm.signupBirthdate.value;
        const phone = signupForm.signupPhone.value;

        // Basic validation
        if (!email || !password || !birthdate || !phone) {
            if (window.showAlert) {
                window.showAlert("Please fill in all fields.");
            } else {
                alert("Please fill in all fields.");
            }
            return;
        }

        if (password.length < 6) {
            if (window.showAlert) {
                window.showAlert("Password should be at least 6 characters.");
            } else {
                alert("Password should be at least 6 characters.");
            }
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user profile data to Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                birthdate: birthdate,
                phone: phone,
                name: "New User", // Default name, can be updated in profile
                school: "N/A",
                address: "N/A",
                yearLevel: "N/A",
                contact: phone // Assuming phone is also contact
            });

            console.log("User signed up and profile created:", user.email);
            if (window.showAlert) {
                window.showAlert("Account created successfully! You are now logged in.");
            }
            // onAuthStateChanged will handle page redirection
        } catch (error) {
            console.error("Sign-up failed:", error.message);
            if (window.showAlert) {
                window.showAlert(`Sign-up failed: ${error.message}`);
            }
        }
    });
}