// main.js - Main application logic

// Import Firebase services and other necessary functions from firebase.js
import {
    auth,
    db,
    appId,
    initialAuthToken,
    signInAnonymously,
    signInWithCustomToken,
    onAuthStateChanged
} from './firebase.js'; // Make sure the path is correct

// Import specific Firebase Auth and Firestore functions
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, onSnapshot, addDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', async () => {
    // --- DOM Elements ---
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainContent = document.getElementById('mainContent');
    const homePageContent = document.getElementById('homePageContent');
    const profilePageContent = document.getElementById('profilePageContent');
    const libraryPageContent = document.getElementById('libraryPageContent');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const logoutButton = document.getElementById('logoutButton');
    const currentUserIdDisplay = document.getElementById('currentUserId');

    const loginEmailInput = document.getElementById('loginEmail'); // Corrected ID
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginErrorSpan = document.getElementById('loginError');

    const signupUsernameInput = document.getElementById('signupUsername');
    const signupEmailInput = document.getElementById('signupEmail');
    const signupPasswordInput = document.getElementById('signupPassword');
    const signupBirthdateInput = document.getElementById('signupBirthdate');
    const signupPhoneInput = document.getElementById('signupPhone');
    const signupErrorSpan = document.getElementById('signupError');

    const navLinks = document.querySelectorAll('#navbar .nav-links a');

    // Home Page Elements
    const homeSearchBar = document.getElementById('homeSearchBar');
    const bookListContainer = document.getElementById('bookList');

    // Library Page Elements
    const librarySearchBar = document.getElementById('librarySearchBar');
    const libraryBookListContainer = document.getElementById('libraryBookList');
    const addBookButton = document.getElementById('addBookButton');

    // Profile Page Elements
    const profileUserIdSpan = document.getElementById('profileUserId');
    const profileEmailSpan = document.getElementById('profileEmail');
    const profileUsernameSpan = document.getElementById('profileUsername');
    const profileNameSpan = document.getElementById('profileName');
    const profileSchoolSpan = document.getElementById('profileSchool');
    const profileAddressSpan = document.getElementById('profileAddress');
    const profileYearLevelSpan = document.getElementById('profileYearLevel');
    const profileContactSpan = document.getElementById('profileContact');
    const editProfileButton = document.getElementById('editProfileButton');

    // Modal Elements
    const customAlertModal = document.getElementById('customAlertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkButton = document.getElementById('alertOkButton');

    const customPromptModal = document.getElementById('customPromptModal');
    const promptMessage = document.getElementById('promptMessage');
    const promptInput = document.getElementById('promptInput');
    const promptOkButton = document.getElementById('promptOkButton');
    const promptCancelButton = document.getElementById('promptCancelButton');

    // --- State Variables ---
    let currentFirebaseUser = null;
    let currentUserId = null;
    let isAuthReady = false; // Flag to ensure auth state is determined before rendering UI
    let userProfileData = {}; // Stores the fetched profile data for the current user
    let allBooks = []; // Stores all books fetched from Firestore

    // --- Custom Modal Functions (Replacing alert() and prompt()) ---
    function showAlert(message) {
        alertMessage.textContent = message;
        customAlertModal.classList.add('active');
        return new Promise(resolve => {
            alertOkButton.onclick = () => {
                customAlertModal.classList.remove('active');
                resolve();
            };
        });
    }

    function showPrompt(message, defaultValue = '') {
        promptMessage.textContent = message;
        promptInput.value = defaultValue;
        customPromptModal.classList.add('active');
        return new Promise(resolve => {
            promptOkButton.onclick = () => {
                customPromptModal.classList.remove('active');
                resolve(promptInput.value);
            };
            promptCancelButton.onclick = () => {
                customPromptModal.classList.remove('active');
                resolve(null); // Return null if cancelled
            };
        });
    }

    // --- UI Rendering & Navigation ---
    function showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
    }

    function showContentPage(pageId) {
        document.querySelectorAll('.content-page').forEach(page => {
            page.classList.add('hidden-page');
        });
        document.getElementById(pageId).classList.remove('hidden-page');
    }

    async function renderAuthUI() {
        if (!isAuthReady) {
            // Still waiting for Firebase auth state to be determined
            return;
        }

        if (currentFirebaseUser) {
            loginPage.classList.remove('active');
            signupPage.classList.remove('active');
            mainContent.classList.add('active');
            currentUserIdDisplay.textContent = `User ID: ${currentUserId.substring(0, 8)}...`; // Truncate for display
            showContentPage('homePageContent'); // Default to home after login
            await fetchUserProfile(currentUserId); // Fetch user profile on login
            setupBookListener(); // Start listening for books
        } else {
            mainContent.classList.remove('active');
            currentUserIdDisplay.textContent = '';
            showPage('loginPage'); // Default to login if not logged in
        }
    }

    // --- Firebase Authentication Handlers ---
    // This listener runs whenever the user's sign-in state changes
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentFirebaseUser = user;
            currentUserId = user.uid;
            console.log("Auth state changed: User logged in", user.uid);
        } else {
            currentFirebaseUser = null;
            currentUserId = null;
            console.log("Auth state changed: User logged out or no user.");
            // If no user, try to sign in with custom token or anonymously (for Canvas environment)
            if (initialAuthToken) {
                try {
                    await signInWithCustomToken(auth, initialAuthToken);
                    currentFirebaseUser = auth.currentUser;
                    currentUserId = auth.currentUser?.uid;
                    console.log("Signed in with custom token.");
                } catch (error) {
                    console.error("Error signing in with custom token:", error);
                    // Fallback to anonymous if custom token fails
                    await signInAnonymously(auth);
                    currentFirebaseUser = auth.currentUser;
                    currentUserId = auth.currentUser?.uid;
                    console.log("Signed in anonymously after custom token error.");
                }
            } else {
                // If no custom token, sign in anonymously
                await signInAnonymously(auth);
                currentFirebaseUser = auth.currentUser;
                currentUserId = auth.currentUser?.uid;
                console.log("Signed in anonymously.");
            }
        }
        isAuthReady = true; // Auth state is now determined
        renderAuthUI(); // Update UI based on auth state
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmailInput.value; // Corrected ID
        const password = loginPasswordInput.value;
        loginErrorSpan.textContent = ''; // Clear previous errors

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged listener will handle UI update
            await showAlert('Login successful!');
        } catch (error) {
            console.error("Login failed:", error.message);
            loginErrorSpan.textContent = `Login failed: ${error.message}`;
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = signupUsernameInput.value;
        const email = signupEmailInput.value;
        const password = signupPasswordInput.value;
        const birthdate = signupBirthdateInput.value;
        const phoneNumber = signupPhoneInput.value;
        signupErrorSpan.textContent = ''; // Clear previous errors

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Save user profile data to Firestore
            // Path: artifacts/{appId}/users/{userId}/profiles/{profileId}
            const userProfileRef = doc(db, `artifacts/${appId}/users/${newUser.uid}/profiles`, newUser.uid);
            await setDoc(userProfileRef, {
                username: username,
                email: email,
                birthdate: birthdate || '',
                phoneNumber: phoneNumber || '',
                fullName: '', // Can be updated later
                school: '',
                address: '',
                yearLevel: ''
            });

            await showAlert('Sign-up successful! You can now log in.');
            showPage('loginPage'); // Go back to login after signup
            signupForm.reset(); // Clear form fields
        } catch (error) {
            console.error("Sign-up failed:", error.message);
            signupErrorSpan.textContent = `Sign-up failed: ${error.message}`;
        }
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('signupPage');
        loginErrorSpan.textContent = ''; // Clear errors when switching
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('loginPage');
        signupErrorSpan.textContent = ''; // Clear errors when switching
    });

    logoutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            await showAlert('Logged out successfully!');
            // onAuthStateChanged listener will handle UI update
        } catch (error) {
            console.error("Logout failed:", error.message);
            await showAlert(`Logout failed: ${error.message}`);
        }
    });

    // --- Navigation Button Handlers ---
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (currentFirebaseUser) {
                showContentPage(page + 'PageContent');
                // Re-render content based on page
                if (page === 'profile') {
                    await fetchUserProfile(currentUserId);
                }
                // Books are handled by the real-time listener (setupBookListener)
            } else {
                await showAlert('Please log in to access this page.');
                showPage('loginPage');
            }
        });
    });

    // --- Book Rendering & Fetching Functions ---
    function renderBookCard(book) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <img src="${book.imageUrl || `https://placehold.co/150x200/cccccc/333333?text=${book.title.substring(0, Math.min(book.title.length, 10))}`}" alt="${book.title}" onerror="this.onerror=null; this.src='https://placehold.co/150x200/cccccc/333333?text=No+Image';">
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            ${book.category ? `<p style="font-size: 0.8em; color: #777;">Category: ${book.category}</p>` : ''}
        `;
        return bookCard;
    }

    function renderBooks(booksToRender, container) {
        container.innerHTML = ''; // Clear existing books
        if (booksToRender.length === 0) {
            container.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1;">No books found. Add some from the Library page!</p>';
            return;
        }
        booksToRender.forEach(book => {
            container.appendChild(renderBookCard(book));
        });
    }

    // Real-time listener for books (public data)
    function setupBookListener() {
        if (!db || !isAuthReady) return; // Ensure Firestore is initialized and auth state is ready
        const booksColRef = collection(db, `artifacts/${appId}/public/data/books`);
        const q = query(booksColRef);

        // onSnapshot provides real-time updates
        onSnapshot(q, (snapshot) => {
            allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Re-render books on both home and library pages if they are active
            if (!homePageContent.classList.contains('hidden-page')) {
                renderBooks(filterBooks(homeSearchBar.value), bookListContainer);
            }
            if (!libraryPageContent.classList.contains('hidden-page')) {
                renderBooks(filterBooks(librarySearchBar.value), libraryBookListContainer);
            }
        }, (error) => {
            console.error("Error fetching books from Firestore:", error);
            showAlert("Error loading books. Please try again later.");
        });
    }

    // --- Search Functionality ---
    function filterBooks(searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return allBooks.filter(book =>
            book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
            (book.category && book.category.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }

    homeSearchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const filtered = filterBooks(searchTerm);
        renderBooks(filtered, bookListContainer);
    });

    librarySearchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const filtered = filterBooks(searchTerm);
        renderBooks(filtered, libraryBookListContainer);
    });

    // --- Profile Page Logic (now from Firestore) ---
    async function fetchUserProfile(uid) {
        if (!db || !uid) {
            userProfileData = {}; // Clear data if no user
            renderProfile();
            return;
        }
        try {
            // Path: artifacts/{appId}/users/{userId}/profiles/{profileId}
            const userProfileRef = doc(db, `artifacts/${appId}/users/${uid}/profiles`, uid);
            const docSnap = await getDoc(userProfileRef);
            if (docSnap.exists()) {
                userProfileData = docSnap.data();
                console.log("User profile fetched:", userProfileData);
            } else {
                console.log("No profile found for user, creating default.");
                // Create a basic profile if none exists (e.g., for new sign-ups)
                userProfileData = {
                    username: currentFirebaseUser.email ? currentFirebaseUser.email.split('@')[0] : 'default_user',
                    email: currentFirebaseUser.email || '',
                    fullName: '', school: '', address: '', yearLevel: '', phoneNumber: '', birthdate: ''
                };
                await setDoc(userProfileRef, userProfileData);
            }
            renderProfile();
        } catch (e) {
            console.error("Error fetching or creating profile:", e);
            showAlert("Error loading profile. Please try again.");
        }
    }

    function renderProfile() {
        if (currentFirebaseUser && userProfileData.email) { // Ensure userProfileData is loaded
            profileUserIdSpan.textContent = currentUserId || 'N/A';
            profileEmailSpan.textContent = userProfileData.email || 'N/A';
            profileUsernameSpan.textContent = userProfileData.username || 'N/A';
            profileNameSpan.textContent = userProfileData.fullName || 'Not set';
            profileSchoolSpan.textContent = userProfileData.school || 'Not set';
            profileAddressSpan.textContent = userProfileData.address || 'Not set';
            profileYearLevelSpan.textContent = userProfileData.yearLevel || 'Not set';
            profileContactSpan.textContent = userProfileData.phoneNumber || 'Not set';
        } else {
            // Default display if no user or profile data
            profileUserIdSpan.textContent = 'Please log in';
            profileEmailSpan.textContent = 'Please log in';
            profileUsernameSpan.textContent = 'Please log in';
            profileNameSpan.textContent = 'First Name, Middle Name, Surname';
            profileSchoolSpan.textContent = '';
            profileAddressSpan.textContent = '';
            profileYearLevelSpan.textContent = '';
            profileContactSpan.textContent = '';
        }
    }

    editProfileButton.addEventListener('click', async () => {
        if (!currentFirebaseUser) {
            await showAlert('Please log in to edit your profile.');
            return;
        }

        // Use current userProfileData for prompts
        const newFullName = await showPrompt('Enter Student\'s Full Name (First, Middle, Surname):', userProfileData.fullName || '');
        if (newFullName === null) return;

        const newSchool = await showPrompt('Enter School:', userProfileData.school || '');
        if (newSchool === null) return;

        const newAddress = await showPrompt('Enter Address:', userProfileData.address || '');
        if (newAddress === null) return;

        const newYearLevel = await showPrompt('Enter Year Level:', userProfileData.yearLevel || '');
        if (newYearLevel === null) return;

        const newContact = await showPrompt('Enter Contact Number:', userProfileData.phoneNumber || '');
        if (newContact === null) return;

        const updatedData = {
            fullName: newFullName,
            school: newSchool,
            address: newAddress,
            yearLevel: newYearLevel,
            phoneNumber: newContact
        };

        try {
            const userProfileRef = doc(db, `artifacts/${appId}/users/${currentUserId}/profiles`, currentUserId);
            await setDoc(userProfileRef, updatedData, { merge: true }); // Use merge: true to only update specified fields
            userProfileData = { ...userProfileData, ...updatedData }; // Update local state
            await showAlert('Profile updated successfully!');
            renderProfile(); // Re-render profile with updated data
        } catch (e) {
            console.error("Error updating profile:", e);
            await showAlert("Error updating profile. Please try again.");
        }
    });

    // --- Add Book Functionality (Library Page) ---
    addBookButton.addEventListener('click', async () => {
        if (!currentFirebaseUser) {
            await showAlert('Please log in to add books.');
            return;
        }

        const title = await showPrompt("Enter Book Title:");
        if (!title) {
            if (title !== null) await showAlert("Book title cannot be empty.");
            return;
        }

        const author = await showPrompt("Enter Author:");
        if (!author) {
            if (author !== null) await showAlert("Author cannot be empty.");
            return;
        }

        const category = await showPrompt("Enter Category (e.g., Programming):");
        if (!category) {
            if (category !== null) await showAlert("Category cannot be empty.");
            return;
        }

        const imageUrl = await showPrompt("Enter Image URL (optional, leave blank for placeholder):", `https://placehold.co/150x200/cccccc/333333?text=${title.substring(0, Math.min(title.length, 10))}`);

        const newBook = {
            title: title,
            author: author,
            category: category,
            imageUrl: imageUrl || `https://placehold.co/150x200/cccccc/333333?text=${title.substring(0, Math.min(title.length, 10))}`
        };

        try {
            // Add a new document to the 'books' collection. Firestore will auto-generate the ID.
            await addDoc(collection(db, `artifacts/${appId}/public/data/books`), newBook);
            await showAlert('Book added successfully!');
            // Books will automatically re-render due to onSnapshot listener in setupBookListener()
        } catch (e) {
            console.error("Error adding book:", e);
            await showAlert("Error adding book. Please try again.");
        }
    });

    // --- Initial Load ---
    // The onAuthStateChanged listener in firebase.js will trigger renderAuthUI() initially
    // after Firebase has determined the user's authentication state.
});
