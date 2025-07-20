import { loadBooks } from "./books.js";

/* --------------------------- GLOBAL ALERT & PROMPT --------------------------- */
window.showAlert = function (text) {
    const alertMsg = document.getElementById("alertMessage");
    const customAlert = document.getElementById("customAlertModal");
    const alertOK = document.getElementById("alertOkButton");
    alertMsg.textContent = text;
    customAlert.style.display = "flex";
    alertOK.onclick = () => {
        customAlert.style.display = "none";
    };
};
window.showPrompt = function (text, initial = "") {
    return new Promise((resolve) => {
        const promptMsg = document.getElementById("promptMessage");
        const promptInput = document.getElementById("promptInput");
        const promptOK = document.getElementById("promptOkButton");
        const promptCancel = document.getElementById("promptCancelButton");
        const customPrompt = document.getElementById("customPromptModal");
        promptMsg.textContent = text;
        promptInput.value = initial;
        customPrompt.style.display = "flex";
        promptOK.onclick = () => {
            customPrompt.style.display = "none";
            resolve(promptInput.value);
        };
        promptCancel.onclick = () => {
            customPrompt.style.display = "none";
            resolve(null);
        };
    });
};
window.showConfirm = function (text) {
    return new Promise((resolve) => {
        const confirmModal = document.getElementById("customAlertModal");
        const confirmMessage = document.getElementById("alertMessage");
        const okButton = document.getElementById("alertOkButton");
        let cancelButton = document.getElementById("confirmCancelButton");
        if (!cancelButton) {
            cancelButton = document.createElement("button");
            cancelButton.id = "confirmCancelButton";
            cancelButton.textContent = "Cancel";
            cancelButton.className = "modal-button cancel";
        }

        const modalButtonsDiv = okButton.parentNode;
        modalButtonsDiv.innerHTML = '';
        modalButtonsDiv.appendChild(okButton);
        modalButtonsDiv.appendChild(cancelButton);

        confirmMessage.textContent = text;
        confirmModal.style.display = "flex";

        okButton.onclick = () => {
            confirmModal.style.display = "none";
            resolve(true);
        };
        cancelButton.onclick = () => {
            confirmModal.style.display = "none";
            resolve(false);
        };
    });
};

/* --------------------------- DARK MODE TOGGLE --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    // Book content modal functionality
    const bookContentModal = document.getElementById('bookContentModal');
    const bookContentClose = document.querySelector('.book-content-modal-close');

    if (bookContentClose) {
        bookContentClose.addEventListener('click', () => {
            bookContentModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === bookContentModal) {
            bookContentModal.style.display = 'none';
        }
    });

    // Navigation and Page Display (assuming loginPage/signupPage/mainContent are managed by authh.js initially)
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainContent = document.getElementById('mainContent');

    // Authentication Form Toggles
    const showLoginLink = document.getElementById('showLogin');
    const showSignupLink = document.getElementById('showSignup');

    if (showLoginLink && showSignupLink && loginPage && signupPage) {
        showSignupLink.addEventListener('click', (event) => {
            event.preventDefault();
            loginPage.classList.remove('active');
            loginPage.classList.add('hidden');
            signupPage.classList.remove('hidden');
            signupPage.classList.add('active');
        });

        showLoginLink.addEventListener('click', (event) => {
            event.preventDefault();
            signupPage.classList.remove('active');
            signupPage.classList.add('hidden');
            loginPage.classList.remove('hidden');
            loginPage.classList.add('active');
        });
    }

    // Function to show/hide content pages within mainContent
    function showContentPage(pageId) {
        const pages = document.querySelectorAll('.content-page');
        pages.forEach(page => {
            page.classList.add('hidden-page');
            page.classList.remove('active-page');
        });
        const activePage = document.getElementById(pageId);
        if (activePage) {
            activePage.classList.remove('hidden-page');
            activePage.classList.add('active-page');
        }

        // Update active class for nav links (within the mainContent navbar)
        const navLinks = document.querySelectorAll('#navbar .nav-links');
        navLinks.forEach(link => link.classList.remove('active'));

        const currentNavLink = document.querySelector(`#navbar .nav-links[data-page="${pageId.replace('PageContent', '')}"]`);
        if (currentNavLink) {
            currentNavLink.classList.add('active');
        }
    }


    // Event listener for the "Home" button in the navbar
    const homeNavToLoginButton = document.getElementById('homeNavToLoginButton');
    if (homeNavToLoginButton) {
        homeNavToLoginButton.addEventListener('click', (event) => {
            event.preventDefault();
            // This is the key change: When "Home" is clicked while logged in,
            // it should show the homePageContent, not go back to login.
            showContentPage('homePageContent');
        });
    }

    // Event listeners for internal navigation links (Profile, Library, Write)
    const profileNavLink = document.getElementById('profileNavLink');
    const libraryNavLink = document.getElementById('libraryNavLink');
    const writeButton = document.getElementById('writeButton');


    if (profileNavLink) {
        profileNavLink.addEventListener('click', (event) => {
            event.preventDefault();
            showContentPage('profilePageContent');
            if (typeof renderProfile === 'function') {
                renderProfile();
            }
        });
    }

    if (libraryNavLink) {
        libraryNavLink.addEventListener('click', (event) => {
            event.preventDefault();
            showContentPage('libraryPageContent');
            loadBooks();
        });
    }

    if (writeButton) {
        writeButton.addEventListener('click', (event) => {
            event.preventDefault();
            showContentPage('writePageContent');
        });
    }
    // Logout button handler (this correctly returns to the login page)
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            // This will trigger the onAuthStateChanged in authh.js to show login page
            // Assuming authh.js handles Firebase signOut.
            window.returnToLoginPage(); // Calls the function to return to the initial login screen
        });
    }

    // Initial page load state: if mainContent is shown, display homePageContent
    if (!mainContent.classList.contains('hidden-content')) {
        showContentPage('homePageContent');
    }

    // Search functionality for home page (using navbar search bar)
    const navbarSearchBar = document.getElementById('navbarSearchBar');
    const homeBookList = document.getElementById('homeBookList');
    const bookCarousel = document.querySelector('.book-carousel');

    if (navbarSearchBar && (homeBookList || bookCarousel)) {
        navbarSearchBar.addEventListener('input', () => {
            const searchTerm = navbarSearchBar.value.toLowerCase();
            let allBooks = [];

            if (homeBookList) {
                homeBookList.querySelectorAll('.book-card').forEach(card => allBooks.push(card));
            }
            if (bookCarousel) {
                bookCarousel.querySelectorAll('.book-card').forEach(card => allBooks.push(card));
            }

            allBooks.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const author = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }


    // Search functionality for library
    const librarySearchBar = document.getElementById('librarySearchBar');
    const libraryBookList = document.getElementById('libraryBookList');
    const favoriteBookList = document.getElementById('favoriteBookList');
    const historyBookList = document.getElementById('historyBookList');


    if (librarySearchBar && (libraryBookList || favoriteBookList || historyBookList)) {
        librarySearchBar.addEventListener('input', () => {
            const searchTerm = librarySearchBar.value.toLowerCase();
            let allLibraryBooks = [];

            if (libraryBookList) {
                libraryBookList.querySelectorAll('.book-card').forEach(card => allLibraryBooks.push(card));
            }
            if (favoriteBookList) {
                favoriteBookList.querySelectorAll('.book-card').forEach(card => allLibraryBooks.push(card));
            }
            if (historyBookList) {
                historyBookList.querySelectorAll('.book-card').forEach(card => allLibraryBooks.push(card));
            }

            allLibraryBooks.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const author = card.querySelector('p')?.textContent.toLowerCase() || '';
                if (title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }


    // Genre filtering for home page
    const genreButtons = document.querySelectorAll('.genre-button');
    if (genreButtons.length > 0 && homeBookList) {
        genreButtons.forEach(button => {
            button.addEventListener('click', () => {
                genreButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const selectedGenre = button.dataset.genre;
                filterBooksByGenre(selectedGenre);
            });
        });
    }

    function filterBooksByGenre(genre) {
        const bookCards = homeBookList.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            const bookGenre = card.dataset.genre ? card.dataset.genre.toLowerCase() : '';
            if (genre === 'all' || bookGenre === genre) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Carousel scroll functionality
    const carouselWrapper = document.querySelector('.book-carousel');
    const leftButton = document.querySelector('.scroll-button.left');
    const rightButton = document.querySelector('.scroll-button.right');

    if (carouselWrapper && leftButton && rightButton) {
        let isDown = false;
        let startX;
        let scrollLeft;

        carouselWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            carouselWrapper.style.cursor = 'grabbing';
            startX = e.pageX - carouselWrapper.offsetLeft;
            scrollLeft = carouselWrapper.scrollLeft;
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            isDown = false;
            carouselWrapper.style.cursor = 'grab';
        });

        carouselWrapper.addEventListener('mouseup', () => {
            isDown = false;
            carouselWrapper.style.cursor = 'grab';
        });

        carouselWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carouselWrapper.offsetLeft;
            const walk = (x - startX) * 2;
            carouselWrapper.scrollLeft = scrollLeft - walk;
        });

        leftButton.addEventListener('click', () => {
            const scrollAmount = carouselWrapper.offsetWidth * 0.7;
            carouselWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightButton.addEventListener('click', () => {
            const scrollAmount = carouselWrapper.offsetWidth * 0.7;
            carouselWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        const toggleScrollButtons = () => {
            const scrollTolerance = 5;
            if (carouselWrapper.scrollLeft <= scrollTolerance) {
                leftButton.style.display = 'none';
            } else {
                leftButton.style.display = 'flex';
            }
            if (carouselWrapper.scrollLeft + carouselWrapper.clientWidth >= carouselWrapper.scrollWidth - scrollTolerance) {
                rightButton.style.display = 'none';
            } else {
                rightButton.style.display = 'flex';
            }
        };

        toggleScrollButtons();
        carouselWrapper.addEventListener('scroll', toggleScrollButtons);
        window.addEventListener('resize', toggleScrollButtons);
    } else {
        console.warn("Carousel elements not found. Carousel functionality will not be active.");
    }

    function renderProfile() {
        // This function should be defined and exported from profile.js
        // If it's not, you might see a console error but the navigation will still work.
        console.log("Rendering profile... (Ensure profile.js is correctly linked and exporting this function)");
    }
});

/* --------------------------- RETURN TO LOGIN PAGE FUNCTION --------------------------- */
// This function is correctly designed to transition back to the login/signup page.
// It should only be called when the user intends to log out or if authentication fails.
function returnToLoginPage() {
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainContent = document.getElementById('mainContent');

    if (loginPage && signupPage && mainContent) {
        mainContent.classList.add('hidden-content');

        loginPage.classList.remove('hidden');
        loginPage.classList.add('active');
        signupPage.classList.add('hidden');
        signupPage.classList.remove('active');

        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        console.error("Could not find loginPage, signupPage, or mainContent elements to return home.");
    }
}

window.returnToLoginPage = returnToLoginPage;