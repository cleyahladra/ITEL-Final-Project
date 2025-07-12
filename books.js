import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
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


import { db } from './firebase.js';
import {
  collection, getDocs, addDoc,
  updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const booksRef = collection(db, "books");
const library = document.getElementById("library");
const form = document.getElementById("bookForm");

// 🔹 CREATE – Add book when user clicks "Create"
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = form.title.value.trim();
  const author = form.author.value.trim();

  if (title && author) {
    await addDoc(booksRef, { title, author });
    form.reset();
    loadBooks(); // Refresh book list
  }
});

// 🔹 READ – Load all books
async function loadBooks() {
  library.innerHTML = ""; // Clear current list
  const snapshot = await getDocs(booksRef);
  snapshot.forEach((docSnap) => {
    const book = docSnap.data();
    const id = docSnap.id;

    // Create HTML for each book
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
      <strong>${book.title}</strong><br>
      <em>by ${book.author}</em><br><br>
      <button onclick="editBook('${id}', '${book.title}', '${book.author}')">Update</button>
      <button onclick="deleteBook('${id}')">Delete</button>
      <hr>
    `;
    library.appendChild(bookCard);
  });
}


window.editBook = async (id, currentTitle, currentAuthor) => {
  const newTitle = prompt("Edit book title:", currentTitle);
  const newAuthor = prompt("Edit author name:", currentAuthor);

  if (newTitle && newAuthor) {
    await updateDoc(doc(db, "books", id), {
      title: newTitle.trim(),
      author: newAuthor.trim()
    });
    loadBooks();
  }
};

// 🔹 DELETE – Confirm and delete
window.deleteBook = async (id) => {
  const confirmDelete = confirm("Are you sure you want to delete this book?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "books", id));
    loadBooks();
  }
};

// Load books on page start
loadBooks();
