import { loadBooks } from "./books.js"

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
        const confirmModal = document.getElementById("customAlertModal"); // Reusing alert modal for simplicity
        const confirmMessage = document.getElementById("alertMessage");
        const okButton = document.getElementById("alertOkButton");
        const cancelButton = document.createElement("button"); 
        cancelButton.textContent = "Cancel";
        cancelButton.className = "modal-button cancel";
        
        
        const modalButtonsDiv = okButton.parentNode;
        while (modalButtonsDiv.children.length > 1) { // Keep only the message
            modalButtonsDiv.removeChild(modalButtonsDiv.lastChild);
        }

        confirmMessage.textContent = text;
        modalButtonsDiv.appendChild(okButton);
        modalButtonsDiv.appendChild(cancelButton); // Add cancel button

        confirmModal.style.display = "flex";

        okButton.onclick = () => {
            confirmModal.style.display = "none";
            modalButtonsDiv.removeChild(cancelButton); // Clean up
            resolve(true);
        };

        cancelButton.onclick = () => {
            confirmModal.style.display = "none";
            modalButtonsDiv.removeChild(cancelButton); // Clean up
            resolve(false);
        };
    });
};



document.addEventListener("DOMContentLoaded", () => {
    // Select all navigation links, including those in the dropdown menu
    const navLinks = document.querySelectorAll(".nav-links a, .dropdown-menu a");
    const contentPages = document.querySelectorAll(".content-page");
    const themeToggle = document.getElementById("themeToggle");
    const writeButton = document.getElementById("writeButton"); 
    

    function showPage(id) {
        contentPages.forEach((p) => {
            p.classList.remove("active-page");
            p.classList.add("hidden-page");
        });
        const page = document.getElementById(id);
        if (page) {
            page.classList.remove("hidden-page");
            page.classList.add("active-page");
        }
    }

    showPage("homePageContent");
    loadBooks();

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const key = link.dataset.page;
            showPage(`${key}PageContent`);
            if (key === "home" || key === "library") {
                loadBooks();
            } else if (key === "profile") {
                renderProfile();
            }
        });
    });

    // Event listener for the "Write" button in the navbar
    if (writeButton) {
        writeButton.addEventListener("click", () => {
            showPage("writePageContent"); // Show the new write page
        });
    }

    
   

    function applyThemePreference() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
        }
    }

    function toggleTheme() {
        if (document.body.classList.contains("dark-mode")) {
            document.body.classList.remove("dark-mode");
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            document.body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }
    applyThemePreference();

    
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
            carouselWrapper.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        rightButton.addEventListener('click', () => {
            const scrollAmount = carouselWrapper.offsetWidth * 0.7; 
            carouselWrapper.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
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
   
    const librarySearchBar = document.getElementById('librarySearchBar');
    const libraryBookList = document.getElementById('libraryBookList');

    // Ensure librarySearchBar and libraryBookList exist before adding event listener
    if (librarySearchBar && libraryBookList) {
        librarySearchBar.addEventListener('input', () => {
            const searchTerm = librarySearchBar.value.toLowerCase();
            const bookCards = libraryBookList.querySelectorAll('.book-card');
            bookCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const author = card.querySelector('p').textContent.toLowerCase();
                const matches = title.includes(searchTerm) || author.includes(searchTerm);
                card.style.display = matches ? 'block' : 'none';
            });
        });
    } else {
        console.warn("Library search bar or book list not found.");
    }

    const homeSearchBar = document.getElementById('homeSearchBar');
    const homeBookList = document.getElementById('homeBookList');
    if (homeSearchBar && homeBookList) {
        homeSearchBar.addEventListener('input', () => {
            const searchTerm = homeSearchBar.value.toLowerCase();
            const bookCards = homeBookList.querySelectorAll('.book-card');
            bookCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const author = card.querySelector('p')?.textContent.toLowerCase() || '';
                const matches = title.includes(searchTerm) || author.includes(searchTerm);
                card.style.display = matches ? 'block' : 'none';
            });
        });
    }

    function renderProfile() {
        console.log("Rendering profile...");
        
    }
   });
document.addEventListener('DOMContentLoaded', () => {
    const homeButton = document.getElementById('homeButton');
    const contentSections = document.querySelectorAll('.content-page');

    homeButton.addEventListener('click', () => {
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.classList.add('hidden-page');
        });

        const homePage = document.getElementById('homePageContent');
        homePage.classList.add('active');
        homePage.classList.remove('hidden-page');
    });
});



document.addEventListener("DOMContentLoaded", () => {
    

    
    const profilePhoto = document.getElementById("profilePhoto"); 
    const profileImageInput = document.getElementById("profileImageInput"); 
    const uploadProfileImageButton = document.getElementById("uploadProfileImage"); 

    
    function renderProfileImage() {
        const savedPhoto = localStorage.getItem("profilePhoto");
        if (profilePhoto) {
            if (savedPhoto) {
                profilePhoto.src = savedPhoto;
            } else {
                profilePhoto.src = "assets/profile-placeholder.png"; 
            }
        }
    }

    
    renderProfileImage();

    if (profileImageInput) {
        profileImageInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const photoDataURL = e.target.result;
                    localStorage.setItem("profilePhoto", photoDataURL); 
                    renderProfileImage(); 
                };
                reader.readAsDataURL(file);
            }
        });
    }


    if (uploadProfileImageButton) {
        uploadProfileImageButton.addEventListener("click", () => {
            
            console.log("Choose Photo button clicked, opening file dialog...");
        });
    }
});



  const photo = localStorage.getItem("profilePhoto");

  if (photo) {
    imagePlaceholder.innerHTML = `
      <img src="${photo}" alt="Profile Image"
        style="width: 130px; height: 130px; border-radius: 50%;
               object-fit: cover; border: 3px solid #e8e8e8ff;">`;
  } else {
    imagePlaceholder.innerHTML = `
      <div style="width: 130px; height: 130px; background: #ccc;
                  border-radius: 50%;"></div>`;
  }
