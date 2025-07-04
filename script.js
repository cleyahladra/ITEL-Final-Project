document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const app = document.getElementById('app');
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

    const navLinks = document.querySelectorAll('#navbar .nav-links a');

    // Home Page Elements
    const homeSearchBar = document.getElementById('homeSearchBar');
    const bookListContainer = document.getElementById('bookList');

    // Library Page Elements
    const librarySearchBar = document.getElementById('librarySearchBar');
    const libraryBookListContainer = document.getElementById('libraryBookList');
    const addBookButton = document.getElementById('addBookButton');

    // Profile Page Elements
    const profileNameSpan = document.getElementById('profileName');
    const profileSchoolSpan = document.getElementById('profileSchool');
    const profileAddressSpan = document.getElementById('profileAddress');
    const profileYearLevelSpan = document.getElementById('profileYearLevel');
    const profileContactSpan = document.getElementById('profileContact');
    const editProfileButton = document.getElementById('editProfileButton');
    const profileSearchBar = document.getElementById('profileSearchBar'); // As per wireframe, though no functionality here

    // Modal Elements
    const customAlertModal = document.getElementById('customAlertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkButton = document.getElementById('alertOkButton');

    const customPromptModal = document.getElementById('customPromptModal');
    const promptMessage = document.getElementById('promptMessage');
    const promptInput = document.getElementById('promptInput');
    const promptOkButton = document.getElementById('promptOkButton');
    const promptCancelButton = document.getElementById('promptCancelButton');

    let resolvePrompt; // To store the resolve function for the prompt promise

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
            resolvePrompt = resolve; // Store resolve function

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

    // --- State Variables (client-side simulation with localStorage) ---
    const LOCAL_STORAGE_USERS_KEY = 'library_log_users';
    const LOCAL_STORAGE_CURRENT_USER_KEY = 'library_log_current_user';
    const LOCAL_STORAGE_BOOKS_KEY = 'library_log_books';

    let users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_KEY)) || [];
    let currentLoggedInUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY));
    let allBooks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BOOKS_KEY)) || [
        // Default books if localStorage is empty, based on wireframes
        { id: 'b1', title: 'Title 1', author: 'Author A', category: 'Fiction', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+1' },
        { id: 'b2', title: 'Title 2', author: 'Author B', category: 'Science', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+2' },
        { id: 'b3', title: 'Title 3', author: 'Author C', category: 'History', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+3' },
        { id: 'b4', title: 'Title 4', author: 'Author D', category: 'Programming', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+4' },
        { id: 'b5', title: 'Title 5', author: 'Author E', category: 'Fantasy', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+5' },
        { id: 'b6', title: 'Title 6', author: 'Author F', category: 'Thriller', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+6' },
        { id: 'b7', title: 'Title 7', author: 'Author G', category: 'Romance', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+7' },
        { id: 'b8', title: 'Title 8', author: 'Author H', category: 'Biography', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Book+8' },
        { id: 'b9', title: 'Javascript', author: 'Brendan Eich', category: 'Programming', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Javascript' },
        { id: 'b10', title: 'Python', author: 'Guido van Rossum', category: 'Programming', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=Python' },
        { id: 'b11', title: 'HTML & CSS', author: 'W3C', category: 'Web Dev', imageUrl: 'https://placehold.co/150x200/cccccc/333333?text=HTML+CSS' }
    ];

    // Functions to save data to localStorage
    function saveUsers() {
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
    }

    function saveCurrentUser() {
        localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(currentLoggedInUser));
    }

    function saveBooks() {
        localStorage.setItem(LOCAL_STORAGE_BOOKS_KEY, JSON.stringify(allBooks));
    }

    // --- Navigation/Routing Logic ---
    function showPage(pageElement) {
        // Hide all main page sections
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        // Show the requested main page section
        pageElement.classList.add('active');
    }

    function showContentPage(pageElement) {
        // Hide all content pages within the mainContent area
        document.querySelectorAll('.content-page').forEach(page => {
            page.classList.add('hidden-page');
        });
        // Show the requested content page
        pageElement.classList.remove('hidden-page');
    }

    function renderAuthUI() {
        if (currentLoggedInUser) {
            // If logged in, hide auth pages and show main content
            loginPage.classList.remove('active');
            signupPage.classList.remove('active');
            mainContent.classList.add('active');
            showContentPage(homePageContent); // Default to home after login
            renderBooks(allBooks, bookListContainer); // Render books on home page
            renderBooks(allBooks, libraryBookListContainer); // Render books on library page
            renderProfile(); // Render profile data
        } else {
            // If not logged in, hide main content and show login page
            mainContent.classList.remove('active');
            showPage(loginPage); // Default to login if not logged in
        }
    }

    // --- Authentication Handlers (Simulated with localStorage) ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameEmail = document.getElementById('loginUsernameEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Find user by username or email and password
        const user = users.find(u => (u.username === usernameEmail || u.email === usernameEmail) && u.password === password);

        if (user) {
            currentLoggedInUser = user;
            saveCurrentUser(); // Save logged-in user to localStorage
            await showAlert('Login successful!');
            renderAuthUI(); // Update UI
        } else {
            await showAlert('Invalid username/email or password.');
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const password = document.getElementById('signupPassword').value;
        const email = document.getElementById('signupEmail').value;
        const birthdate = document.getElementById('signupBirthdate').value;
        const phone = document.getElementById('signupPhone').value;

        // Check for existing username or email
        if (users.some(u => u.email === email)) {
            await showAlert('This email is already registered.');
            return;
        }
        if (users.some(u => u.username === username)) {
            await showAlert('This username is already taken.');
            return;
        }

        const newUser = {
            id: Date.now().toString(), // Simple unique ID
            username: username,
            email: email,
            password: password, // WARNING: In a real app, hash passwords before storing!
            birthdate: birthdate,
            phoneNumber: phone,
            fullName: '', // Placeholder for profile, to be edited later
            school: '',
            address: '',
            yearLevel: ''
        };

        users.push(newUser);
        saveUsers(); // Save new user to localStorage
        await showAlert('Sign-up successful! You can now log in.');
        showPage(loginPage); // Go back to login after signup
        signupForm.reset(); // Clear form fields
    });

    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(signupPage);
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(loginPage);
    });

    logoutButton.addEventListener('click', async () => {
        currentLoggedInUser = null;
        saveCurrentUser(); // Clear current user from localStorage
        await showAlert('Logged out successfully!');
        renderAuthUI(); // Update UI
    });

    // --- Navigation Button Handlers ---
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (currentLoggedInUser) {
                // Determine which content page element to show
                let targetPageElement;
                switch (page) {
                    case 'home': targetPageElement = homePageContent; break;
                    case 'profile': targetPageElement = profilePageContent; renderProfile(); break; // Re-render profile on navigation
                    case 'library': targetPageElement = libraryPageContent; renderBooks(allBooks, libraryBookListContainer); break; // Re-render library books
                    default: targetPageElement = homePageContent;
                }
                showContentPage(targetPageElement);
            } else {
                await showAlert('Please log in to access this page.');
                showPage(loginPage);
            }
        });
    });

    // --- Book Rendering Functions ---
    function renderBookCard(book) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title}" onerror="this.onerror=null; this.src='https://placehold.co/150x200/cccccc/333333?text=No+Image';">
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            ${book.category ? `<p style="font-size: 0.8em; color: #777;">Category: ${book.category}</p>` : ''}
        `;
        return bookCard;
    }

    function renderBooks(booksToRender, container) {
        container.innerHTML = ''; // Clear existing books
        if (booksToRender.length === 0) {
            container.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1;">No books found.</p>';
            return;
        }
        booksToRender.forEach(book => {
            container.appendChild(renderBookCard(book));
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

    // --- Profile Page Logic ---
    function renderProfile() {
        if (currentLoggedInUser) {
            // Find the full user profile from the 'users' array
            const userProfile = users.find(u => u.id === currentLoggedInUser.id);
            if (userProfile) {
                profileNameSpan.textContent = userProfile.fullName || 'First Name, Middle Name, Surname';
                profileSchoolSpan.textContent = userProfile.school || '';
                profileAddressSpan.textContent = userProfile.address || '';
                profileYearLevelSpan.textContent = userProfile.yearLevel || '';
                profileContactSpan.textContent = userProfile.phoneNumber || '';
            } else {
                console.error("Current logged-in user not found in local storage users array.");
                showAlert("Error loading profile data.");
            }
        } else {
            // Default display if not logged in
            profileNameSpan.textContent = 'First Name, Middle Name, Surname';
            profileSchoolSpan.textContent = '';
            profileAddressSpan.textContent = '';
            profileYearLevelSpan.textContent = '';
            profileContactSpan.textContent = '';
        }
    }

    editProfileButton.addEventListener('click', async () => {
        if (!currentLoggedInUser) {
            await showAlert('Please log in to edit your profile.');
            return;
        }

        // Find the user's actual profile data in the 'users' array
        const userIndex = users.findIndex(u => u.id === currentLoggedInUser.id);
        if (userIndex === -1) {
            await showAlert("Error: User profile not found for editing.");
            return;
        }
        let userProfile = users[userIndex]; // Get a reference to the actual user object

        const newFullName = await showPrompt('Enter Student\'s Full Name (First, Middle, Surname):', userProfile.fullName || '');
        if (newFullName === null) return; // User cancelled

        const newSchool = await showPrompt('Enter School:', userProfile.school || '');
        if (newSchool === null) return;

        const newAddress = await showPrompt('Enter Address:', userProfile.address || '');
        if (newAddress === null) return;

        const newYearLevel = await showPrompt('Enter Year Level:', userProfile.yearLevel || '');
        if (newYearLevel === null) return;

        const newContact = await showPrompt('Enter Contact Number:', userProfile.phoneNumber || '');
        if (newContact === null) return;

        // Update the userProfile object directly
        userProfile.fullName = newFullName;
        userProfile.school = newSchool;
        userProfile.address = newAddress;
        userProfile.yearLevel = newYearLevel;
        userProfile.phoneNumber = newContact;

        // Update the users array and currentLoggedInUser (if it's the same user)
        users[userIndex] = userProfile;
        currentLoggedInUser = userProfile; // Update the session user too

        saveUsers(); // Save the updated users array to localStorage
        saveCurrentUser(); // Save the updated current user to localStorage

        await showAlert('Profile updated successfully!');
        renderProfile(); // Re-render profile with updated data
    });

    // --- Add Book Functionality (Library Page) ---
    addBookButton.addEventListener('click', async () => {
        if (!currentLoggedInUser) {
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

        const category = await showPrompt("Enter Category (e.g., Javascript):");
        if (!category) {
            if (category !== null) await showAlert("Category cannot be empty.");
            return;
        }

        const imageUrl = await showPrompt("Enter Image URL (optional, leave blank for placeholder):", `https://placehold.co/150x200/cccccc/333333?text=${title.substring(0, Math.min(title.length, 10))}`);

        const newBook = {
            id: 'b' + (allBooks.length + 1), // Simple unique ID
            title: title,
            author: author,
            category: category,
            imageUrl: imageUrl || `https://placehold.co/150x200/cccccc/333333?text=${title.substring(0, Math.min(title.length, 10))}`
        };

        allBooks.push(newBook);
        saveBooks(); // Save the updated books array to localStorage
        await showAlert('Book added successfully!');
        renderBooks(allBooks, libraryBookListContainer); // Re-render library books
        renderBooks(allBooks, bookListContainer); // Re-render home page books
    });

    // --- Initial Render on Load ---
    saveBooks(); // Ensure default books are saved on first load if not present
    renderAuthUI(); // Show appropriate page based on login status
});
