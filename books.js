
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


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
const booksCol = collection(db, "books");

// 📌 Select both book display containers
const homeBookList = document.getElementById("bookList"); // homepage
const libraryBookList = document.getElementById("libraryDynamicBookList"); // library page

// Add book using prompt
document.getElementById("addBookBtn")?.addEventListener("click", async () => {
  const title = prompt("Enter title:");
  const author = prompt("Enter author:");
  const content = prompt("Enter book content (optional):");

  if (!title || !author) return;

  const book = {
    title: title.trim(),
    author: author.trim(),
    content: content ? content.trim() : "",
    favorite: false,
    imageUrl: "https://via.placeholder.com/100x150?text=Book"
  };

  try {
    await addDoc(booksCol, book);
    alert("Book saved!");
    loadBooks();
  } catch (error) {
    console.error("Error saving book:", error);
  }
});

// Add book using form
const userBookForm = document.getElementById("userBookForm");
userBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

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
    imageUrl: "https://via.placeholder.com/100x150?text=Book"
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

// 📌 Load and display books into both home and library
async function loadBooks() {
  if (homeBookList) homeBookList.innerHTML = "";
  if (libraryBookList) libraryBookList.innerHTML = "";

  const snapshot = await getDocs(booksCol);
  snapshot.forEach((docSnap) => {
    const book = docSnap.data();
    const bookId = docSnap.id;

    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img src="${book.imageUrl}" alt="Book Cover">
      <h3>${book.title}</h3>
      <p><strong>by:</strong> ${book.author}</p>
      <p>${book.content ? book.content.slice(0, 100) + "..." : ""}</p>
      <button onclick="editBook('${bookId}', '${book.title}', '${book.author}', \`${book.content || ""}\`)">Edit</button>
      <button onclick="deleteBook('${bookId}')">Delete</button>
    `;

    if (homeBookList) homeBookList.appendChild(card.cloneNode(true));
    if (libraryBookList) libraryBookList.appendChild(card);
  });
}

// Edit book
window.editBook = async function (id, oldTitle, oldAuthor, oldContent = "") {
  const newTitle = prompt("Edit title:", oldTitle);
  const newAuthor = prompt("Edit author:", oldAuthor);
  const newContent = prompt("Edit content:", oldContent);

  if (!newTitle || !newAuthor || !newContent) return;

  const bookRef = doc(db, "books", id);
  await updateDoc(bookRef, {
    title: newTitle.trim(),
    author: newAuthor.trim(),
    content: newContent.trim()
  });

  alert("Book updated!");
  loadBooks();
};

// Delete book
window.deleteBook = async function (id) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  const bookRef = doc(db, "books", id);
  await deleteDoc(bookRef);

  alert("Book deleted!");
  loadBooks();
};

// Load books on page load
loadBooks();

export { loadBooks };
