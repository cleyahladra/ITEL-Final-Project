/* ---------- script.js (paste over the old file) ---------- */
import { loadBooks } from "./books.js";

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------- DOM ELEMENTS --------------------------- */
  const navLinks = document.querySelectorAll(".nav-links a");
  const contentPages = document.querySelectorAll(".content-page");
  const themeToggle = document.getElementById("themeToggle"); // Get the theme toggle button

  const editProfileBtn = document.getElementById("editProfileButton");

  /* ------------- PROFILE FIELDS ------------- */
  const profileName = document.getElementById("profileName");
  const profileSchool = document.getElementById("profileSchool");
  const profileAddress = document.getElementById("profileAddress");
  const profileYearLevel = document.getElementById("profileYearLevel");
  const profileContact = document.getElementById("profileContact");

  /* ------------- MODAL ELEMENTS ------------- */
  const customAlert = document.getElementById("customAlertModal");
  const alertMsg = document.getElementById("alertMessage");
  const alertOK = document.getElementById("alertOkButton");

  const customPrompt = document.getElementById("customPromptModal");
  const promptMsg = document.getElementById("promptMessage");
  const promptInput = document.getElementById("promptInput");
  const promptOK = document.getElementById("promptOkButton");
  const promptCancel = document.getElementById("promptCancelButton");

  /* ------------- SIMPLE PROFILE DATA ------------- */
  let userProfile = {
    name: "First Name, Middle Name, Surname",
    school: "Your School Here",
    address: "Your Address Here",
    yearLevel: "Your Year Level Here",
    contact: "Your Phone Number Here",
  };

  /* ------------------------ MODAL HELPERS ------------------------ */
  function showAlert(text) {
    alertMsg.textContent = text;
    customAlert.style.display = "flex";
  }
  alertOK.addEventListener("click", () => {
    customAlert.style.display = "none";
  });

  function showPrompt(text, initial = "") {
    return new Promise((resolve) => {
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
  }

  /* ------------------------ PAGE NAVIGATION ------------------------ */
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

  // initial page
  showPage("homePageContent");
  loadBooks();                       // first Firestore fetch

  // click handlers
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const key = link.dataset.page; // home | profile | library
      showPage(`${key}PageContent`);

      if (key === "home" || key === "library") {
        loadBooks();                 // refresh book grids
      } else if (key === "profile") {
        renderProfile();
      }
    });
  });

  /* --------------------- PROFILE RENDER / EDIT --------------------- */
  function renderProfile() {
    profileName.textContent = userProfile.name;
    profileSchool.textContent = userProfile.school;
    profileAddress.textContent = userProfile.address;
    profileYearLevel.textContent = userProfile.yearLevel;
    profileContact.textContent = userProfile.contact;
  }
  renderProfile();

  editProfileBtn.addEventListener("click", async () => {
    const n = await showPrompt("Enter new Student's Name:", userProfile.name);
    if (n !== null) userProfile.name = n.trim();

    const s = await showPrompt("Enter new School:", userProfile.school);
    if (s !== null) userProfile.school = s.trim();

    const a = await showPrompt("Enter new Address:", userProfile.address);
    if (a !== null) userProfile.address = a.trim();

    const y = await showPrompt("Enter new Year Level:", userProfile.yearLevel);
    if (y !== null) userProfile.yearLevel = y.trim();

    const c = await showPrompt("Enter new Contact Number:", userProfile.contact);
    if (c !== null) userProfile.contact = c.trim();

    renderProfile();
    showAlert("Profile updated successfully!");
  });

  /* ------------------------ THEME TOGGLE LOGIC ------------------------ */

  /**
   * Applies the stored theme preference or defaults to light mode.
   */
  function applyThemePreference() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      // Default to light mode if no preference or explicitly 'light'
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }

  /**
   * Toggles the theme between dark and light mode.
   * Stores the preference in localStorage.
   */
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

  // Event listener for the theme toggle button
  themeToggle.addEventListener("click", toggleTheme);

  // Apply theme preference when the page loads
  applyThemePreference();
});