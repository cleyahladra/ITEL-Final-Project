//MAY NADAGDAG DITO GETDOC,QUERY,ORDERBY-CHERRY
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
//ETO NADAGDAG DIN-CHERRY
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


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
const db = getFirestore(app);
//ETO NADAGDAG-CHERRY
const auth = getAuth(app);
const booksCol = collection(db, "books");

//ETO NADAGDAG
const homeBookList = document.getElementById("homeBookList");      // homepage list
const libraryBookList = document.getElementById("libraryBookList"); // library page list (corrected ID)
let currentUser = null;                                        // signed in user

onAuthStateChanged(auth, user => {
  currentUser = user;           // cache for later
  loadBooks();                  // refresh UI when auth state changes
});

// ------------------------------
// Predefined Static Books (New Addition)
// These books will always appear and will not be editable by users.
// ------------------------------
const predefinedBooks = [
    {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        imageUrl: "https://via.placeholder.com/100x150?text=The+Hobbit",
        content: "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
        favorite: false,
        creatorId: "system", // Special ID to indicate it's not user-editable
        createdAt: 1 // A low timestamp so it might appear after dynamic books if sorted by date, or just fixed in order
    },
    {
        title: "1984",
        author: "George Orwell",
        imageUrl: "https://via.placeholder.com/100x150?text=1984",
        content: "The year 1984. Everywhere stood the telescreens, which received and transmitted simultaneously.",
        favorite: false,
        creatorId: "system",
        createdAt: 2
    },
    {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        imageUrl: "https://via.placeholder.com/100x150?text=Pride+and+Prejudice",
        content: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        favorite: false,
        creatorId: "system",
        createdAt: 3
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        imageUrl: "https://via.placeholder.com/100x150?text=To+Kill+a+Mockingbird",
        content: "When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow.",
        favorite: false,
        creatorId: "system",
        createdAt: 4
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        imageUrl: "https://via.placeholder.com/100x150?text=The+Great+Gatsby",
        content: "In my younger and more vulnerable years my father gave me some advice that I’ve been turning over in my mind ever since.",
        favorite: false,
        creatorId: "system",
        createdAt: 5
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        imageUrl: "https://via.placeholder.com/100x150?text=Dune",
        content: "A beginning is the time for taking the most delicate care that the balances are correct.",
        favorite: false,
        creatorId: "system",
        createdAt: 6
    }
];

// ------------------------------
// Function to "open" a book (display details in a modal)
// ------------------------------
window.openBook = function(title, author, content) {
    const modal = document.getElementById("bookContentModal");
    const modalTitle = document.getElementById("modalBookTitle");
    const modalAuthor = document.getElementById("modalBookAuthor");
    const modalContent = document.getElementById("modalBookContent");
    const closeButton = document.querySelector(".book-content-modal-close");

    modalTitle.textContent = title;
    modalAuthor.textContent = `by ${author}`;
    modalContent.textContent = content || "No content provided.";

    modal.classList.add("active"); // Show the modal

    // Close modal when close button is clicked
    closeButton.onclick = () => {
        modal.classList.remove("active");
    };

    // Close modal when clicking outside the content
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.remove("active");
        }
    };
}

// ------------------------------
// 3 · Add book (quick prompt button)
// ------------------------------
document.getElementById("addBookBtn")?.addEventListener("click", async () => {
  //NADAGDAG-CHERRY
  if (!currentUser) {
    alert("You must sign in before adding a book.");
    return;
  }

  const title = prompt("Enter title:");
  const author = prompt("Enter author:");
  const content = prompt("Enter book content (optional):");

  if (!title || !author) return;

  const book = {
    title: title.trim(),
    author: author.trim(),
    content: content ? content.trim() : "",
    favorite: false,
    imageUrl: "https://via.placeholder.com/100x150?text=Book",
    //NADAGDAG
    creatorId: currentUser.uid,             // ⭐ owner tag
    createdAt: Date.now()
  };

  try {
    await addDoc(booksCol, book);
    alert("Book saved!");
    loadBooks();
  } catch (error) {
    console.error("Error saving book:", error);
  }
});

const userBookForm = document.getElementById("userBookForm"); // This element doesn't exist in index.html
userBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
//NADAGDAG ULIT
  if (!currentUser) {
    alert("You must sign in before publishing a book.");
    return;
  }

  const title = document.getElementById("userBookTitle").value.trim();
  const author = document.getElementById("userBookAuthor").value.trim();
  const content = document.getElementById("userBookContent").value.trim();

  if (!title || !author || !content) {
    alert("Please fill out all fields.");
    return;
  }

  const newBook = {
    title,
    author,
    content,
    favorite: false,
    imageUrl: "https://via.placeholder.com/100x150?text=Book",
    //NEW
    creatorId: currentUser.uid,             // ⭐ owner tag
    createdAt: Date.now()
  };

  try {
    await addDoc(booksCol, newBook);
    alert("Your book has been published!");
    userBookForm.reset();
    loadBooks();
  } catch (e) {
    console.error("Error saving book:", e);
    alert("Failed to save book. Try again.");
  }
});

async function loadBooks() {
  if (homeBookList) homeBookList.innerHTML = "";
  if (libraryBookList) libraryBookList.innerHTML = "";

  // 1. Render predefined static-like books first// BAGO
  predefinedBooks.forEach(bookData => {
      // Sanitize content for passing to onclick, especially if it contains quotes
      const sanitizedTitle = bookData.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
      const sanitizedAuthor = bookData.author.replace(/'/g, "\\'").replace(/"/g, '\\"');
      const sanitizedContent = (bookData.content || "").replace(/'/g, "\\'").replace(/"/g, '\\"');

      // Build card markup - NO EDIT/DELETE BUTTONS FOR PREDEFINED BOOKS
      const cardHTML = `
          <img src="${bookData.imageUrl}" alt="Book Cover">
          <h3>${bookData.title}</h3>
          <p><strong>by:</strong> ${bookData.author}</p>
          <p class="book-content-preview">${bookData.content ? bookData.content.slice(0, 80) + "..." : "No content preview."}</p>
          `;

      const card = document.createElement("div");
      card.className = "book-card";
      // Add onclick to the card itself to "open" the book
      card.setAttribute('onclick', `openBook('${sanitizedTitle}', '${sanitizedAuthor}', '${sanitizedContent}')`);
      card.innerHTML = cardHTML;

      // Append to both homepage & library pages if they exist
      if (homeBookList) {
          homeBookList.appendChild(card.cloneNode(true)); // Use clone for home to avoid moving element
      }
      if (libraryBookList) {
          libraryBookList.appendChild(card.cloneNode(true)); // Use clone for library as well
      }
  });

  // 2. Then, fetch and render dynamic books from Firestore
  // Sort them by newest first (you can change 'desc' to 'asc' if you want oldest first)
  const q = query(booksCol, orderBy("createdAt", "asc")); // Changed from "desc" to "asc"
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const bookId = docSnap.id;

    //BAGOOOOO
    // Check if the current user owns this book (and it's not a 'system' book)
    const isOwner = currentUser && currentUser.uid === data.creatorId && data.creatorId !== "system";

    const sanitizedTitle = data.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const sanitizedAuthor = data.author.replace(/'/g, "\\'").replace(/"/g, '\\"');
    const sanitizedContent = (data.content || "").replace(/'/g, "\\'").replace(/"/g, '\\"');

    const buttonsHTML = isOwner
      ? `<div class="book-actions">
           <button onclick="event.stopPropagation(); editBook('${bookId}', '${sanitizedTitle}', '${sanitizedAuthor}', '${sanitizedContent}')">Edit</button>
           <button onclick="event.stopPropagation(); deleteBook('${bookId}')">Delete</button>
         </div>`
      : "";

    const cardHTML = `
      <img src="${data.imageUrl}" alt="Book Cover">
      <h3>${data.title}</h3>
      <p><strong>by:</strong> ${data.author}</p>
      <p class="book-content-preview">${data.content ? data.content.slice(0, 80) + "..." : "No content preview."}</p>
      ${buttonsHTML}
    `;

    const card = document.createElement("div");
    card.className = "book-card";
    card.setAttribute('onclick', `openBook('${sanitizedTitle}', '${sanitizedAuthor}', '${sanitizedContent}')`);
    card.innerHTML = cardHTML;

    // Append to both homepage & library pages if they exist
    if (homeBookList) {
        homeBookList.appendChild(card.cloneNode(true));
    }
    if (libraryBookList) {
        libraryBookList.appendChild(card); // Use original for library or clone if you want separate DOM nodes
    }
  });
}

// ------------------------------
// 6 · Edit book (owner only)
// ------------------------------
window.editBook = async function (id, oldTitle, oldAuthor, oldContent = "") {
  // Double check ownership in case someone tampers with the DOM
  const bookRef = doc(db, "books", id);
  const snap = await getDoc(bookRef);

  if (!snap.exists()) {
    alert("Book not found.");
    return;
  }
  // Ensure the book is not a 'system' book and current user is the creator
  if (!currentUser || currentUser.uid !== snap.data().creatorId || snap.data().creatorId === "system") {
    alert("You do not have permission to edit this book.");
    return;
  }

  const newTitle = prompt("Edit title:", oldTitle);
  const newAuthor = prompt("Edit author:", oldAuthor);
  const newContent = prompt("Edit content:", oldContent);

  if (newTitle === null || newAuthor === null || newContent === null) return; // User cancelled prompt

  await updateDoc(bookRef, {
    title: newTitle.trim(),
    author: newAuthor.trim(),
    content: newContent.trim()
  });

  alert("Book updated!");
  loadBooks();
};

// ------------------------------
// 7 · Delete book (owner only)
// ------------------------------
window.deleteBook = async function (id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  const bookRef = doc(db, "books", id);
  const snap = await getDoc(bookRef);

  if (!snap.exists()) {
    alert("Book not found.");
    return;
  }
  // Ensure the book is not a 'system' book and current user is the creator
  if (!currentUser || currentUser.uid !== snap.data().creatorId || snap.data().creatorId === "system") {
    alert("You do not have permission to delete this book.");
    return;
  }

  await deleteDoc(bookRef);
  alert("Book deleted!");
  loadBooks();
};

// ------------------------------
// 8 · Initial load
// ------------------------------
loadBooks();

export { loadBooks };
