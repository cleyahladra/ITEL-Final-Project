
import { loadBooks } from "./books.js";

document.addEventListener("DOMContentLoaded", () => {
  
  const navLinks     = document.querySelectorAll(".nav-links a");
  const contentPages = document.querySelectorAll(".content-page");

  const editProfileBtn = document.getElementById("editProfileButton");

 
  const profileName      = document.getElementById("profileName");
  const profileSchool    = document.getElementById("profileSchool");
  const profileAddress   = document.getElementById("profileAddress");
  const profileYearLevel = document.getElementById("profileYearLevel");
  const profileContact   = document.getElementById("profileContact");

  
  const customAlert  = document.getElementById("customAlertModal");
  const alertMsg     = document.getElementById("alertMessage");
  const alertOK      = document.getElementById("alertOkButton");

  const customPrompt = document.getElementById("customPromptModal");
  const promptMsg    = document.getElementById("promptMessage");
  const promptInput  = document.getElementById("promptInput");
  const promptOK     = document.getElementById("promptOkButton");
  const promptCancel = document.getElementById("promptCancelButton");

  
  let userProfile = {
    name: "First Name, Middle Name, Surname",
    school: "Your School Here",
    address: "Your Address Here",
    yearLevel: "Your Year Level Here",
    contact: "Your Phone Number Here",
  };

  
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
      const key = link.dataset.page; // home | profile | library
      showPage(`${key}PageContent`);

      if (key === "home" || key === "library") {
        loadBooks();                 
      } else if (key === "profile") {
        renderProfile();
      }
    });
  });

  
  function renderProfile() {
    profileName.textContent      = userProfile.name;
    profileSchool.textContent    = userProfile.school;
    profileAddress.textContent   = userProfile.address;
    profileYearLevel.textContent = userProfile.yearLevel;
    profileContact.textContent   = userProfile.contact;
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
});


const librarySearchBar = document.getElementById('librarySearchBar');
const libraryBookList = document.getElementById('libraryBookList');


librarySearchBar.addEventListener('input', () => {
  const searchTerm = librarySearchBar.value.toLowerCase();

  
  const bookCards = libraryBookList.querySelectorAll('.book-card');

  bookCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const author = card.querySelector('p').textContent.toLowerCase();

    // Check if the title or author includes the search term
    const matches = title.includes(searchTerm) || author.includes(searchTerm);

    
    card.style.display = matches ? 'block' : 'none';
  });
});

