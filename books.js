// ------------------------------
// books.js – CRUD for Library Log
// Now includes per‑user ownership locks
// ------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// ------------------------------
// 1 · Firebase setup
// ------------------------------
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
const auth = getAuth(app);
const booksCol = collection(db, "books");

// ------------------------------
// 2 · Global refs & helpers
// ------------------------------
const homeBookList = document.getElementById("bookList");      // homepage list
const libraryBookList = document.getElementById("libraryDynamicBookList"); // library page list
let currentUser = null;                                        // signed‑in user

onAuthStateChanged(auth, user => {
  currentUser = user;           // cache for later
  loadBooks();                  // refresh UI when auth state changes
});

// ------------------------------
// 3 · Add book (quick‑prompt button)
// ------------------------------
document.getElementById("addBookBtn")?.addEventListener("click", async () => {
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

// ------------------------------
// 4 · Add book (form version)
// ------------------------------
const userBookForm = document.getElementById("userBookForm");
userBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

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

// ------------------------------
// 5 · Render books list
// ------------------------------
async function loadBooks() {
  if (homeBookList) homeBookList.innerHTML = "";
  if (libraryBookList) libraryBookList.innerHTML = "";

  // Order by newest first (swap to whatever you prefer)
  const q = query(booksCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const bookId = docSnap.id;
    const isOwner = currentUser && currentUser.uid === data.creatorId;

    // Build card markup
    const buttonsHTML = isOwner
      ? `\n      <button onclick="editBook('${bookId}', \`${data.title}\`, \`${data.author}\`, \`${data.content || ""}\`)">Edit</button>\n      <button onclick="deleteBook('${bookId}')">Delete</button>`
      : "";

    const cardHTML = `
      <img src="${data.imageUrl}" alt="Book Cover">
      <h3>${data.title}</h3>
      <p><strong>by:</strong> ${data.author}</p>
      <p>${data.content ? data.content.slice(0, 100) + "..." : ""}</p>
      ${buttonsHTML}
    `;

    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = cardHTML;

    // Append to both homepage & library pages if they exist
    if (homeBookList) homeBookList.appendChild(card.cloneNode(true));
    if (libraryBookList) libraryBookList.appendChild(card);
  });
}

// ------------------------------
// 6 · Edit book (owner‑only)
// ------------------------------
window.editBook = async function (id, oldTitle, oldAuthor, oldContent = "") {
  // Double‑check ownership in case someone tampers with the DOM
  const bookRef = doc(db, "books", id);
  const snap = await getDoc(bookRef);

  if (!snap.exists()) {
    alert("Book not found.");
    return;
  }
  if (!currentUser || currentUser.uid !== snap.data().creatorId) {
    alert("You do not have permission to edit this book.");
    return;
  }

  const newTitle = prompt("Edit title:", oldTitle);
  const newAuthor = prompt("Edit author:", oldAuthor);
  const newContent = prompt("Edit content:", oldContent);

  if (!newTitle || !newAuthor || !newContent) return;

  await updateDoc(bookRef, {
    title: newTitle.trim(),
    author: newAuthor.trim(),
    content: newContent.trim()
  });

  alert("Book updated!");
  loadBooks();
};

// ------------------------------
// 7 · Delete book (owner‑only)
// ------------------------------
window.deleteBook = async function (id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  const bookRef = doc(db, "books", id);
  const snap = await getDoc(bookRef);

  if (!snap.exists()) {
    alert("Book not found.");
    return;
  }
  if (!currentUser || currentUser.uid !== snap.data().creatorId) {
    alert("You do not have permission to delete this book.");
    return;
  }

  await deleteDoc(bookRef);
  alert("Book deleted!");
  loadBooks();
};

// ------------------------------
// 8 · Initial load
// ------------------------------
loadBooks();

export { loadBooks };
