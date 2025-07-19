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

/* --------------------------- DOM READY --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  const contentPages = document.querySelectorAll(".content-page");
  const themeToggle = document.getElementById("themeToggle");

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

  themeToggle.addEventListener("click", toggleTheme);
  applyThemePreference();
});


const librarySearchBar = document.getElementById('librarySearchBar');
const libraryBookList = document.getElementById('libraryBookList');

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
