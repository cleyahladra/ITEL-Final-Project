// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const contentPages = document.querySelectorAll('.content-page');

    const homeSearchBar = document.getElementById('homeSearchBar');
    const librarySearchBar = document.getElementById('librarySearchBar');
    const addBookButton = document.getElementById('addBookButton');
    const editProfileButton = document.getElementById('editProfileButton');

    const bookListContainer = document.getElementById('bookList');
    const libraryBookListContainer = document.getElementById('libraryBookList');

    // Profile fields
    const profileName = document.getElementById('profileName');
    const profileSchool = document.getElementById('profileSchool');
    const profileAddress = document.getElementById('profileAddress');
    const profileYearLevel = document.getElementById('profileYearLevel');
    const profileContact = document.getElementById('profileContact');

    // --- Modal Elements ---
    const customAlertModal = document.getElementById('customAlertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkButton = document.getElementById('alertOkButton');

    const customPromptModal = document.getElementById('customPromptModal');
    const promptMessage = document.getElementById('promptMessage');
    const promptInput = document.getElementById('promptInput');
    const promptOkButton = document.getElementById('promptOkButton');
    const promptCancelButton = document.getElementById('promptCancelButton');

    // --- Data Storage (for demonstration, replace with database interaction later) ---
    // Start with some dummy book data
    let books = [
        { id: 'b001', title: 'The Hobbit', author: 'J.R.R. Tolkien', imageUrl: 'https://via.placeholder.com/100x150?text=The+Hobbit' },
        { id: 'b002', title: '1984', author: 'George Orwell', imageUrl: 'https://via.placeholder.com/100x150?text=1984' },
        { id: 'b003', title: 'Pride and Prejudice', author: 'Jane Austen', imageUrl: 'https://via.placeholder.com/100x150?text=Pride+and+Prejudice' },
        { id: 'b004', title: 'To Kill a Mockingbird', author: 'Harper Lee', imageUrl: 'https://via.placeholder.com/100x150?text=To+Kill+a+Mockingbird' },
        { id: 'b005', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', imageUrl: 'https://via.placeholder.com/100x150?text=The+Great+Gatsby' },
        { id: 'b006', title: 'Dune', author: 'Frank Herbert', imageUrl: 'https://via.placeholder.com/100x150?text=Dune' },
    ];

    // Dummy user profile data
    let userProfile = {
        name: "First Name, Middle Name, Surname",
        school: "Your School Here",
        address: "Your Address Here",
        yearLevel: "Your Year Level Here",
        contact: "Your Phone Number Here"
    };

    // --- Helper Functions for Modals ---
    /**
     * Displays a custom alert modal.
     * @param {string} message The message to display.
     */
    function showAlert(message) {
        alertMessage.textContent = message;
        customAlertModal.style.display = 'flex'; // Use flex to center
    }

    /**
     * Displays a custom prompt modal and returns a Promise with the user's input or null if cancelled.
     * @param {string} message The message for the prompt.
     * @param {string} initialValue Optional initial value for the input field.
     * @returns {Promise<string|null>} Resolves with input string or null.
     */
    function showPrompt(message, initialValue = '') {
        return new Promise((resolve) => {
            promptMessage.textContent = message;
            promptInput.value = initialValue;
            customPromptModal.style.display = 'flex'; // Use flex to center

            promptOkButton.onclick = () => {
                customPromptModal.style.display = 'none';
                resolve(promptInput.value);
            };

            promptCancelButton.onclick = () => {
                customPromptModal.style.display = 'none';
                resolve(null); // User cancelled
            };
        });
    }

    // Event listener for the alert's OK button
    alertOkButton.addEventListener('click', () => {
        customAlertModal.style.display = 'none';
    });

    // --- Page Navigation ---
    /**
     * Switches the active content page based on the data-page attribute.
     * @param {string} targetPageId The ID of the page to show (e.g., 'homePageContent').
     */
    function showPage(targetPageId) {
        contentPages.forEach(page => {
            page.classList.remove('active-page');
            page.classList.add('hidden-page'); // Ensure others are truly hidden
        });
        const targetPage = document.getElementById(targetPageId);
        if (targetPage) {
            targetPage.classList.remove('hidden-page');
            targetPage.classList.add('active-page');
        }
    }

    // Set initial page to Home
    showPage('homePageContent');

    // Add event listeners for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default link behavior
            const pageName = link.dataset.page; // 'home', 'profile', 'library'
            showPage(`${pageName}PageContent`);

            // Re-render books/profile when navigating to ensure fresh display
            if (pageName === 'home') {
                renderBooks(books, bookListContainer.id);
            } else if (pageName === 'library') {
                renderBooks(books, libraryBookListContainer.id);
            } else if (pageName === 'profile') {
                renderProfile();
            }
        });
    });

    // --- Book Rendering ---
    /**
     * Renders a list of books into a specified container.
     * @param {Array<Object>} bookList An array of book objects.
     * @param {string} containerId The ID of the HTML element where books should be rendered.
     * @param {boolean} allowActions If true, enables edit/delete buttons for library view.
     */
    function renderBooks(bookList, containerId, allowActions = false) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear current content

        if (bookList.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #777;">No books found. Try adding some!</p>';
            return;
        }

        bookList.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.classList.add('book-item');
            bookItem.innerHTML = `
                <img src="${book.imageUrl || 'https://via.placeholder.com/100x150?text=No+Cover'}" alt="${book.title} Cover">
                <p class="book-title">${book.title}</p>
                <p class="book-author">by ${book.author}</p>
                ${allowActions ? `
                    <div class="book-actions">
                        <button class="action-button edit-book" data-id="${book.id}">Edit</button>
                        <button class="action-button delete-book" data-id="${book.id}">Delete</button>
                    </div>
                ` : ''}
            `;
            container.appendChild(bookItem);
        });

        // Add event listeners for edit/delete if allowed
        if (allowActions) {
            container.querySelectorAll('.edit-book').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const bookId = e.target.dataset.id;
                    const bookToEdit = books.find(b => b.id === bookId);
                    if (bookToEdit) {
                        const newTitle = await showPrompt('Edit Title:', bookToEdit.title);
                        if (newTitle === null) return; // Cancelled

                        const newAuthor = await showPrompt('Edit Author:', bookToEdit.author);
                        if (newAuthor === null) return; // Cancelled

                        if (newTitle.trim() && newAuthor.trim()) {
                            bookToEdit.title = newTitle.trim();
                            bookToEdit.author = newAuthor.trim();
                            // Optional: Update image URL
                            renderBooks(books, containerId, true); // Re-render to show changes
                            renderBooks(books, bookListContainer.id, false); // Update home page as well
                            showAlert('Book updated successfully!');
                        } else {
                            showAlert('Title and author cannot be empty.');
                        }
                    }
                });
            });

            container.querySelectorAll('.delete-book').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bookId = e.target.dataset.id;
                    if (confirm('Are you sure you want to delete this book?')) {
                        books = books.filter(book => book.id !== bookId);
                        renderBooks(books, containerId, true); // Re-render library view
                        renderBooks(books, bookListContainer.id, false); // Update home page as well
                        showAlert('Book deleted successfully!');
                    }
                });
            });
        }
    }

    // Initial render for Home and Library pages
    renderBooks(books, bookListContainer.id, false); // Home page (no edit/delete)
    renderBooks(books, libraryBookListContainer.id, true); // Library page (with edit/delete)

    // --- Search Functionality ---
    function filterAndRenderBooks(searchTerm, targetContainerId, allowActions) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            book.author.toLowerCase().includes(lowerCaseSearchTerm)
        );
        renderBooks(filteredBooks, targetContainerId, allowActions);
    }

    homeSearchBar.addEventListener('input', (e) => {
        filterAndRenderBooks(e.target.value, bookListContainer.id, false);
    });

    librarySearchBar.addEventListener('input', (e) => {
        filterAndRenderBooks(e.target.value, libraryBookListContainer.id, true);
    });

    // --- Add New Book Functionality ---
    addBookButton.addEventListener('click', async () => {
        const newTitle = await showPrompt("Enter the title of the new book:");
        if (newTitle === null) return; // User cancelled

        const newAuthor = await showPrompt("Enter the author of the new book:");
        if (newAuthor === null) return; // User cancelled

        if (newTitle.trim() && newAuthor.trim()) {
            const newBook = {
                // Simple ID generation for now; in a real app, use UUIDs or database IDs
                id: `b${Date.now()}`,
                title: newTitle.trim(),
                author: newAuthor.trim(),
                imageUrl: 'https://via.placeholder.com/100x150?text=New+Book' // Default image
            };
            books.push(newBook);
            renderBooks(books, bookListContainer.id, false); // Update Home page
            renderBooks(books, libraryBookListContainer.id, true); // Update Library page
            showAlert("Book added successfully!");
        } else {
            showAlert("Book title and author cannot be empty.");
        }
    });

    // --- Profile Management ---
    /**
     * Renders the user profile details onto the profile page.
     */
    function renderProfile() {
        profileName.textContent = userProfile.name;
        profileSchool.textContent = userProfile.school;
        profileAddress.textContent = userProfile.address;
        profileYearLevel.textContent = userProfile.yearLevel;
        profileContact.textContent = userProfile.contact;
    }

    // Initial render of the profile
    renderProfile();

    editProfileButton.addEventListener('click', async () => {
        const newName = await showPrompt("Enter new Student's Name:", userProfile.name);
        if (newName !== null) userProfile.name = newName.trim();

        const newSchool = await showPrompt("Enter new School:", userProfile.school);
        if (newSchool !== null) userProfile.school = newSchool.trim();

        const newAddress = await showPrompt("Enter new Address:", userProfile.address);
        if (newAddress !== null) userProfile.address = newAddress.trim();

        const newYearLevel = await showPrompt("Enter new Year Level:", userProfile.yearLevel);
        if (newYearLevel !== null) userProfile.yearLevel = newYearLevel.trim();

        const newContact = await showPrompt("Enter new Contact Number:", userProfile.contact);
        if (newContact !== null) userProfile.contact = newContact.trim();

        renderProfile(); // Update the displayed profile
        showAlert("Profile updated successfully!");
    });
});