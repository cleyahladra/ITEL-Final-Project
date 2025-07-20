// books.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, query, orderBy, arrayUnion, arrayRemove, setDoc} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
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
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    loadBooks(); // Reload books when auth state changes
});

const homeBookList = document.getElementById('homeBookList');
const libraryBookList = document.getElementById('libraryBookList');
const favoriteBookList = document.getElementById('favoriteBookList');
const historyBookList = document.getElementById('historyBookList');
const addBookBtn = document.getElementById('addBookBtn');
const bookContentModal = document.getElementById('bookContentModal');
const modalBookTitle = document.getElementById('modalBookTitle');
const modalBookAuthor = document.getElementById('modalBookAuthor');
const modalBookContent = document.getElementById('modalBookContent');
const modalCloseBtn = document.querySelector('.book-content-modal-close');
const writeForm = document.getElementById('writeForm'); // Get the write form
const writeTitle = document.getElementById('writeTitle');
const writeAuthor = document.getElementById('writeAuthor');
const writeGenre = document.getElementById('writeGenre');
const writeImageUrl = document.getElementById('writeImageUrl');
const writeContent = document.getElementById('writeContent');

// Updated predefinedBooks with genre property and more books
const predefinedBooks = [
    { id: "system-1", title: "The Hobbit", author: "J.R.R. Tolkien", content: "A classic fantasy novel about Bilbo Baggins' unexpected journey.", imageUrl: "https://i.ibb.co/FLdB20MM/images.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-2", title: "1984", author: "George Orwell", content: "A dystopian social science fiction novel by English author George Orwell. Published on 8 June 1949 by Secker & Warburg, it is set in Airstrip One (formerly Great Britain), a province of the superstate Oceania, where the Party maintains power through surveillance, propaganda, and repression.", imageUrl: "https://i.ibb.co/7j93f33/1984.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-3", title: "Pride and Prejudice", author: "Jane Austen", content: "A romantic novel of manners written by Jane Austen in 1813. The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, absence, and marriage in the society of the landed gentry of the British Regency.", imageUrl: "https://i.ibb.co/3k5fH4L/prideandprejudice.jpg", creatorId: "system", genre: "romance" },
    { id: "system-4", title: "To Kill a Mockingbird", author: "Harper Lee", content: "A novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.", imageUrl: "https://i.ibb.co/f2f5m1T/tokillamockingbird.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-5", title: "The Great Gatsby", author: "F. Scott Fitzgerald", content: "A novel illustrating the Jazz Age.", imageUrl: "https://i.ibb.co/wJ1yD25/greatgatsby.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-6", title: "Dune", author: "Frank Herbert", content: "A science fiction novel set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs.", imageUrl: "https://i.ibb.co/R73f98P/dune.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-7", title: "Murder on the Orient Express", author: "Agatha Christie", content: "A detective novel by the English writer Agatha Christie, featuring the Belgian detective Hercule Poirot.", imageUrl: "https://i.ibb.co/tZQ1x11/orientexpress.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-8", title: "The Silent Patient", author: "Alex Michaelides", content: "A shocking psychological thriller about a woman's act of violence against her husband—and the psychotherapist obsessed with uncovering what happened.", imageUrl: "https://i.ibb.co/y4Lg30f/silentpatient.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-9", title: "Educated", author: "Tara Westover", content: "An American memoir by Tara Westover, published in February 2018. It tells the story of her journey from growing up in a fundamentalist Mormon household in rural Idaho to earning a PhD at Cambridge University.", imageUrl: "https://i.ibb.co/v4bM0jD/educated.jpg", creatorId: "system", genre: "biography" },
    { id: "system-10", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", content: "A book by Yuval Noah Harari, first published in Hebrew in 2011 and in English in 2014. It surveys the history of humankind from the Stone Age up to the twenty-first century.", imageUrl: "https://i.ibb.co/9y2zN3N/sapiens.jpg", creatorId: "system", genre: "history" },
    { id: "system-11", title: "Atomic Habits", author: "James Clear", content: "An American self-help book by James Clear. It offers a practical framework for improving every day.", imageUrl: "https://i.ibb.co/X8gP21L/atomichabits.jpg", creatorId: "system", genre: "self-help" },
    { id: "system-12", title: "The Alchemist", author: "Paulo Coelho", content: "An allegorical novel by Brazilian author Paulo Coelho, first published in 1988. It's about a young shepherd who journeys from his homeland in Spain to the Egyptian desert in search of a treasure.", imageUrl: "https://i.ibb.co/k5v5W1g/alchemist.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-13", title: "The Lord of the Rings", author: "J.R.R. Tolkien", content: "An epic high-fantasy novel. Follows Frodo Baggins on a quest to destroy the One Ring.", imageUrl: "https://i.ibb.co/L89Yf2S/lordoftherings.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-14", title: "Foundation", author: "Isaac Asimov", content: "A science fiction novel that is the first of the Foundation series. Chronicles the decline of the Galactic Empire.", imageUrl: "https://i.ibb.co/s2J2bS3/foundation.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-15", title: "The Da Vinci Code", author: "Dan Brown", content: "A mystery thriller novel. Follows symbologist Robert Langdon and cryptologist Sophie Neveu as they investigate a murder in Paris.", imageUrl: "https://i.ibb.co/gMw8sXf/davincicode.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-16", title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", content: "A comedy science fiction series created by Douglas Adams. Follows the adventures of Arthur Dent after the destruction of Earth.", imageUrl: "https://i.ibb.co/5c9j1G7/hitchhikersguide.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-17", title: "Sense and Sensibility", author: "Jane Austen", content: "A novel by Jane Austen. Explores the Dashwood sisters' experiences with love, romance, and heartbreak.", imageUrl: "https://i.ibb.co/P4y4W9z/senseandsensibility.jpg", creatorId: "system", genre: "romance" },
    { id: "system-18", title: "Crime and Punishment", author: "Fyodor Dostoevsky", content: "A novel by Fyodor Dostoevsky. Focuses on the mental anguish and moral dilemmas of Rodion Raskolnikov, a former student.", imageUrl: "https://i.ibb.co/Qn3P0tP/crimeandpunishment.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-19", title: "The Picture of Dorian Gray", author: "Oscar Wilde", content: "A philosophical novel by Oscar Wilde. Tells of a young man whose portrait ages while he remains young and beautiful.", imageUrl: "https://i.ibb.co/8Y4T7jC/doriangray.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-20", title: "Frankenstein", author: "Mary Shelley", content: "A novel by Mary Shelley. Deals with themes of ambition, creation, and responsibility.", imageUrl: "https://i.ibb.co/yQ6B9S8/frankenstein.jpg", creatorId: "system", genre: "horror" },
    { id: "system-21", title: "Dracula", author: "Bram Stoker", content: "A Gothic horror novel by Irish author Bram Stoker. Introduces the character of Count Dracula.", imageUrl: "https://i.ibb.co/Yj3X5Qj/dracula.jpg", creatorId: "system", genre: "horror" },
    { id: "system-22", title: "The Odyssey", author: "Homer", content: "One of two major ancient Greek epic poems attributed to Homer. Recounts the journey of Odysseus back to Ithaca.", imageUrl: "https://i.ibb.co/gR2s2Jg/odyssey.jpg", creatorId: "system", genre: "classic" },
    { id: "system-23", title: "Don Quixote", author: "Miguel de Cervantes", content: "A Spanish novel by Miguel de Cervantes. Tells the story of a hidalgo who reads too many chivalric romances.", imageUrl: "https://i.ibb.co/VDy1kQG/donquixote.jpg", creatorId: "system", genre: "classic" },
    { id: "system-24", title: "Moby Dick", author: "Herman Melville", content: "A novel by Herman Melville. Explores the obsessive quest of Captain Ahab for the white whale, Moby Dick.", imageUrl: "https://i.ibb.co/sK0t9gL/mobydick.jpg", creatorId: "system", genre: "classic" },
    { id: "system-25", title: "War and Peace", author: "Leo Tolstoy", content: "A novel by the Russian author Leo Tolstoy. Chronicles the history of the French invasion of Russia.", imageUrl: "https://i.ibb.co/vj1p0k0/warandpeace.jpg", creatorId: "system", genre: "classic" },
    { id: "system-26", title: "The Catcher in the Rye", author: "J.D. Salinger", content: "A novel by J. D. Salinger. Explores themes of alienation and innocence.", imageUrl: "https://i.ibb.co/j3g2B1T/catcher.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-27", title: "The Grapes of Wrath", author: "John Steinbeck", content: "A novel by John Steinbeck. Depicts the struggles of an Oklahoman family during the Dust Bowl.", imageUrl: "https://i.ibb.co/Zf2h0YQ/grapesofwrath.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-28", title: "Brave New World", author: "Aldous Huxley", content: "A dystopian novel by Aldous Huxley. Explores a future world where human reproduction is controlled.", imageUrl: "https://i.ibb.co/R2x1J4X/bravenewworld.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-29", title: "The Martian", author: "Andy Weir", content: "A science fiction novel by Andy Weir. Follows an astronaut stranded on Mars.", imageUrl: "https://i.ibb.co/qN2s4bY/martian.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-30", title: "Project Hail Mary", author: "Andy Weir", content: "A science fiction novel by Andy Weir. Follows an amnesiac astronaut on a mission to save humanity.", imageUrl: "https://i.ibb.co/Pz2X5Yd/projecthailmary.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-31", title: "The Hunger Games", author: "Suzanne Collins", content: "A dystopian novel by Suzanne Collins. Follows Katniss Everdeen as she fights for survival.", imageUrl: "https://i.ibb.co/c2j9m0d/hungergames.jpg", creatorId: "system", genre: "young adult" },
    { id: "system-32", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", content: "The first novel in the Harry Potter series. Follows Harry Potter's first year at Hogwarts.", imageUrl: "https://i.ibb.co/fY2K1Xf/harrypotter1.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-33", title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", content: "A fantasy novel that is the first published and best known of the seven novels in The Chronicles of Narnia.", imageUrl: "https://i.ibb.co/5T9c0vP/narnia.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-34", title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", content: "A psychological thriller novel. Investigates the disappearance of a wealthy girl.", imageUrl: "https://i.ibb.co/bF9j2xR/dragontattoo.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-35", title: "Gone Girl", author: "Gillian Flynn", content: "A psychological thriller novel by Gillian Flynn. Explores the disappearance of a woman on her fifth wedding anniversary.", imageUrl: "https://i.ibb.co/5v1d3tP/gonegirl.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-36", title: "The Silent Corner", author: "Dean Koontz", content: "A thriller novel. A woman discovers her husband's secret life after his death.", imageUrl: "https://i.ibb.co/8Y4T7jC/silentcorner.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-37", title: "The Guest List", author: "Lucy Fokley", content: "A mystery thriller novel. A wedding turns deadly on a remote Irish island.", imageUrl: "https://i.ibb.co/f4F3H1Z/guestlist.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-38", title: "Big Little Lies", author: "Liane Moriarty", content: "A novel about secrets and lies among a group of mothers.", imageUrl: "https://i.ibb.co/F8z1c2V/biglittlelies.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-39", title: "And Then There Were None", author: "Agatha Christie", content: "A mystery novel. Ten strangers are invited to an isolated island and murdered one by one.", imageUrl: "https://i.ibb.co/W9g2k2R/andthentherewerenone.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-40", title: "The Woman in Cabin 10", author: "Ruth Ware", content: "A mystery thriller novel. A journalist witnesses a body thrown overboard on a luxury cruise.", imageUrl: "https://i.ibb.co/b9k3x1H/womanincabin10.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-41", title: "Where the Crawdads Sing", author: "Delia Owens", content: "A coming-of-age story and a murder mystery.", imageUrl: "https://i.ibb.co/7Y0j1Tq/crawdadssing.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-42", title: "The Nightingale", author: "Kristin Hannah", content: "A historical fiction novel set during World War II.", imageUrl: "https://i.ibb.co/gMw8sXf/nightingale.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-43", title: "All the Light We Cannot See", author: "Anthony Doerr", content: "A historical fiction novel set during World War II. Follows a blind French girl and a young German soldier.", imageUrl: "https://i.ibb.co/Qn3P0tP/allthelight.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-44", title: "The Book Thief", author: "Markus Zusak", content: "A historical novel about a young girl living in Nazi Germany.", imageUrl: "https://i.ibb.co/fY2K1Xf/bookthief.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-45", title: "Circe", author: "Madeline Miller", content: "A mythological fiction novel. Retells the story of Circe, a goddess in Greek mythology.", imageUrl: "https://i.ibb.co/s2J2bS3/circe.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-46", title: "The Song of Achilles", author: "Madeline Miller", content: "A historical and mythological fiction novel. Retells the Trojan War through the eyes of Patroclus.", imageUrl: "https://i.ibb.co/Yj3X5Qj/achilles.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-47", title: "Red, White & Royal Blue", author: "Casey McQuiston", content: "A contemporary romance novel about the First Son of the United States and a British prince.", imageUrl: "https://i.ibb.co/5c9j1G7/redwhite.jpg", creatorId: "system", genre: "romance" },
    { id: "system-48", title: "The Kiss Quotient", author: "Helen Hoang", content: "A contemporary romance novel about a woman with Asperger's syndrome who hires a male escort to teach her about intimacy.", imageUrl: "https://i.ibb.co/P4y4W9z/kissquotient.jpg", creatorId: "system", genre: "romance" },
    { id: "system-49", title: "The Love Hypothesis", author: "Ali Hazelwood", content: "A contemporary romance novel about a fake relationship between a Ph.D. student and a professor.", imageUrl: "https://i.ibb.co/Pz2X5Yd/lovehypothesis.jpg", creatorId: "system", genre: "romance" },
    { id: "system-50", title: "Beach Read", author: "Emily Henry", content: "A contemporary romance novel about two writers with writer's block who swap genres.", imageUrl: "https://i.ibb.co/qN2s4bY/beachread.jpg", creatorId: "system", genre: "romance" },
    { id: "system-51", title: "A Court of Thorns and Roses", author: "Sarah J. Maas", content: "A fantasy novel that blends beauty and the beast with fae lore.", imageUrl: "https://i.ibb.co/Zf2h0YQ/acotar.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-52", title: "From Blood and Ash", author: "Jennifer L. Armentrout", content: "A fantasy romance novel with vampires and forbidden love.", imageUrl: "https://i.ibb.co/vj1p0k0/bloodandash.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-53", title: "Mistborn: The Final Empire", author: "Brandon Sanderson", content: "A high fantasy novel. Follows a group of rebels trying to overthrow an evil empire.", imageUrl: "https://i.ibb.co/j3g2B1T/mistborn.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-54", title: "Name of the Wind", author: "Patrick Rothfuss", content: "A fantasy novel that tells the story of Kvothe, an infamous magician and adventurer.", imageUrl: "https://i.ibb.co/W9g2k2R/nameofwind.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-55", title: "The Blade Itself", author: "Joe Abercrombie", content: "A grimdark fantasy novel, first in The First Law trilogy.", imageUrl: "https://i.ibb.co/b9k3x1H/bladeitself.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-56", title: "American Gods", author: "Neil Gaiman", content: "A fantasy novel. Explores the conflict between Old Gods and New Gods in America.", imageUrl: "https://i.ibb.co/8Y4T7jC/americangods.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-57", title: "Good Omens", author: "Terry Pratchett & Neil Gaiman", content: "A comedic fantasy novel about an angel and a demon trying to prevent the apocalypse.", imageUrl: "https://i.ibb.co/5c9j1G7/goodomens.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-58", title: "Jonathan Strange & Mr Norrell", author: "Susanna Clarke", content: "An alternative history novel. Explores a magical alternative 19th-century England.", imageUrl: "https://i.ibb.co/P4y4W9z/jonathanstrange.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-59", title: "The Priory of the Orange Tree", author: "Samantha Shannon", content: "A high fantasy novel with dragons and queens.", imageUrl: "https://i.ibb.co/Pz2X5Yd/priory.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-60", title: "The Poppy War", author: "R.F. Kuang", content: "An epic fantasy novel inspired by Chinese history.", imageUrl: "https://i.ibb.co/qN2s4bY/poppywar.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-61", title: "Neverwhere", author: "Neil Gaiman", content: "A fantasy novel set in a magical realm coexisting with London.", imageUrl: "https://i.ibb.co/Zf2h0YQ/neverwhere.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-62", title: "Stardust", author: "Neil Gaiman", content: "A fantasy novel about a young man's quest to retrieve a fallen star.", imageUrl: "https://i.ibb.co/vj1p0k0/stardust.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-63", title: "Mythos", author: "Stephen Fry", content: "A retelling of Greek myths.", imageUrl: "https://i.ibb.co/y4Lg30f/mythos.jpg", creatorId: "system", genre: "mythology" },
    { id: "system-64", title: "Norse Mythology", author: "Neil Gaiman", content: "A retelling of Norse myths.", imageUrl: "https://i.ibb.co/k5v5W1g/norsemyth.jpg", creatorId: "system", genre: "mythology" },
    { id: "system-65", title: "The Song of Roland", author: "Anonymous", content: "An epic poem based on the Battle of Roncevaux in 778.", imageUrl: "https://i.ibb.co/R73f98P/roland.jpg", creatorId: "system", genre: "epic" },
    { id: "system-66", title: "Beowulf", author: "Anonymous", content: "An Old English epic poem. One of the most important works of Old English literature.", imageUrl: "https://i.ibb.co/5c9j1G7/beowulf.jpg", creatorId: "system", genre: "epic" },
    { id: "system-67", title: "The Iliad", author: "Homer", content: "An ancient Greek epic poem. Set during the Trojan War.", imageUrl: "https://i.ibb.co/fY2K1Xf/iliad.jpg", creatorId: "system", genre: "epic" },
    { id: "system-68", title: "Meditations", author: "Marcus Aurelius", content: "A series of personal writings by Marcus Aurelius, Roman Emperor from 161 to 180 AD, recording his private notes to himself and ideas on Stoic philosophy.", imageUrl: "https://i.ibb.co/P4y4W9z/meditations.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-69", title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", content: "A philosophical novel by Friedrich Nietzsche, composed in four parts between 1883 and 1885.", imageUrl: "https://i.ibb.co/Pz2X5Yd/zarathustra.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-70", title: "The Republic", author: "Plato", content: "A Socratic dialogue, written by Plato around 375 BC, concerning justice, the order and character of the just city-state, and the just man.", imageUrl: "https://i.ibb.co/qN2s4bY/republic.jpg", creatorId: "system", genre: "philosophy" }
];


// Function to render books into a specified container
function renderBooks(books, containerElement, isUserBook = false) {
    containerElement.innerHTML = ''; // Clear current books
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.dataset.id = book.id;
        bookCard.dataset.genre = book.genre; // Set data-genre attribute
        if (isUserBook) {
            bookCard.classList.add('user-book'); // Add a class for user's own books
        }
        bookCard.innerHTML = `
            <img src="${book.imageUrl}" alt="${book.title}" class="book-thumbnail">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="book-card-actions">
                <button class="read-button">Read</button>
                ${isUserBook ? `<button class="edit-button">Edit</button> <button class="delete-button">Delete</button>` : ''}
                ${!isUserBook && currentUser ? `<button class="add-to-library-button">Add to Library</button>` : ''}
                ${!isUserBook && currentUser ? `<button class="favorite-button">Favorite</button>` : ''}
            </div>
        `;
        containerElement.appendChild(bookCard);

        // Add event listeners for buttons
        bookCard.querySelector('.read-button').addEventListener('click', () => openBookContentModal(book));
        if (isUserBook) {
            bookCard.querySelector('.edit-button').addEventListener('click', () => editBook(book));
            bookCard.querySelector('.delete-button').addEventListener('click', () => deleteBook(book.id));
        }
        if (!isUserBook && currentUser) {
            bookCard.querySelector('.add-to-library-button').addEventListener('click', () => addBookToUserLibrary(book));
            bookCard.querySelector('.favorite-button').addEventListener('click', () => toggleFavoriteBook(book));
        }
    });
}

// Function to open the book content modal
function openBookContentModal(book) {
    modalBookTitle.textContent = book.title;
    modalBookAuthor.textContent = book.author;
    modalBookContent.textContent = book.content;
    bookContentModal.style.display = 'flex';
}

// Close modal button
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
        bookContentModal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === bookContentModal) {
        bookContentModal.style.display = 'none';
    }
});

// Function to load all books (predefined and user's own)
export async function loadBooks() {
    console.log("Loading books...");
    // Clear all lists before re-rendering
    if (homeBookList) homeBookList.innerHTML = '';
    if (libraryBookList) libraryBookList.innerHTML = '';
    if (favoriteBookList) favoriteBookList.innerHTML = '';
    if (historyBookList) historyBookList.innerHTML = '';

    // Render predefined books (e.g., to homeBookList for discovery)
    if (homeBookList) {
        renderBooks(predefinedBooks, homeBookList);
    }

    if (currentUser) {
        // Load user's own created books
        const userBooksCol = collection(db, `users/${currentUser.uid}/books`);
        const userBooksSnapshot = await getDocs(query(userBooksCol, orderBy("createdAt", "desc")));
        const userBooks = userBooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (libraryBookList) {
            renderBooks(userBooks, libraryBookList, true); // Mark as user book for edit/delete buttons
        }

        // Load favorite books
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const favoriteBookIds = userData.favorites || [];
            const historyBookIds = userData.history || [];

            const allAvailableBooks = [...predefinedBooks, ...userBooks]; // Combine for easier lookup

            const favoriteBooks = allAvailableBooks.filter(book => favoriteBookIds.includes(book.id));
            if (favoriteBookList) {
                renderBooks(favoriteBooks, favoriteBookList);
            }

            // Load reading history (simplified: just show books from history IDs)
            const historyBooks = allAvailableBooks.filter(book => historyBookIds.includes(book.id));
            if (historyBookList) {
                renderBooks(historyBooks, historyBookList);
            }
        }
    }

    // After all books are rendered, apply the initial "All" filter to make sure everything is visible
    filterBooksByGenre('All');
}

// Add new book functionality
if (writeForm) {
    writeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) {
            window.showAlert("You must be logged in to add a book.");
            return;
        }

        const newBook = {
            title: writeTitle.value,
            author: writeAuthor.value,
            genre: writeGenre.value,
            imageUrl: writeImageUrl.value || "https://via.placeholder.com/150", // Default image
            content: writeContent.value,
            creatorId: currentUser.uid,
            createdAt: new Date()
        };

        try {
            await addDoc(collection(db, `users/${currentUser.uid}/books`), newBook);
            window.showAlert("Book added successfully!");
            writeForm.reset();
            loadBooks(); // Reload books to show the new addition
            // Optionally, switch to the library page or refresh the view
        } catch (error) {
            console.error("Error adding book:", error);
            window.showAlert("Failed to add book: " + error.message);
        }
    });
}

// Function to add a predefined book to a user's library
async function addBookToUserLibrary(book) {
    if (!currentUser) {
        window.showAlert("You must be logged in to add books to your library.");
        return;
    }
    try {
        const userBookRef = doc(db, `users/${currentUser.uid}/books`, book.id);
        const docSnap = await getDoc(userBookRef);

        if (docSnap.exists()) {
            window.showAlert("This book is already in your library!");
            return;
        }

        await setDoc(userBookRef, {
            ...book,
            creatorId: currentUser.uid, // Ensure it's marked as owned by the user
            createdAt: new Date()
        });
        window.showAlert("Book added to your library!");
        loadBooks(); // Refresh library view
    } catch (error) {
        console.error("Error adding book to library:", error);
        window.showAlert("Failed to add book to library: " + error.message);
    }
}

// Function to toggle favorite status
async function toggleFavoriteBook(book) {
    if (!currentUser) {
        window.showAlert("You must be logged in to favorite books.");
        return;
    }
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
        const userDocSnap = await getDoc(userDocRef);
        let currentFavorites = [];
        if (userDocSnap.exists()) {
            currentFavorites = userDocSnap.data().favorites || [];
        }

        if (currentFavorites.includes(book.id)) {
            // Remove from favorites
            await updateDoc(userDocRef, {
                favorites: arrayRemove(book.id)
            });
            window.showAlert(`"${book.title}" removed from favorites.`);
        } else {
            // Add to favorites
            await updateDoc(userDocRef, {
                favorites: arrayUnion(book.id)
            });
            window.showAlert(`"${book.title}" added to favorites!`);
        }
        loadBooks(); // Refresh favorite list
    } catch (error) {
        console.error("Error toggling favorite:", error);
        window.showAlert("Failed to update favorites: " + error.message);
    }
}

// Function to update book (for user's own books)
async function editBook(book) {
    if (!currentUser || book.creatorId !== currentUser.uid) {
        window.showAlert("You can only edit your own books.");
        return;
    }

    const newTitle = await window.showPrompt("Enter new title:", book.title);
    if (newTitle === null) return; // User cancelled

    const newAuthor = await window.showPrompt("Enter new author:", book.author);
    if (newAuthor === null) return;

    const newGenre = await window.showPrompt("Enter new genre:", book.genre);
    if (newGenre === null) return;

    const newImageUrl = await window.showPrompt("Enter new image URL:", book.imageUrl);
    if (newImageUrl === null) return;

    const newContent = await window.showPrompt("Enter new content:", book.content);
    if (newContent === null) return;

    try {
        const bookRef = doc(db, `users/${currentUser.uid}/books`, book.id);
        await updateDoc(bookRef, {
            title: newTitle,
            author: newAuthor,
            genre: newGenre,
            imageUrl: newImageUrl,
            content: newContent
        });
        window.showAlert("Book updated successfully!");
        loadBooks(); // Reload books to show updated info
    } catch (error) {
        console.error("Error updating book:", error);
        window.showAlert("Failed to update book: " + error.message);
    }
}

// Function to delete book (for user's own books)
window.deleteBook = async function (bookId) {
    if (!currentUser) {
        window.showAlert("You must be logged in to delete books.");
        return;
    }
    const bookRef = doc(db, `users/${currentUser.uid}/books`, bookId);
    const bookSnap = await getDoc(bookRef);

    if (!bookSnap.exists() || bookSnap.data().creatorId !== currentUser.uid) {
        window.showAlert("You can only delete your own books.");
        return;
    }
    await deleteDoc(bookRef);
    window.showAlert("Book deleted!");
    loadBooks();
};

// Genre filter script
document.addEventListener('DOMContentLoaded', () => {
    const genreButtons = document.querySelectorAll('.genre-button');
    genreButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' class from all buttons
            genreButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            button.classList.add('active');
            const genre = button.dataset.genre;
            filterBooksByGenre(genre);
        });
    });

    // Initial call to filter by 'All' when the page loads, after books are rendered
    // This is handled by loadBooks now, but keeping this listener ensures buttons are active
    const allButton = document.querySelector('.genre-button[data-genre="All"]');
    if (allButton) {
        allButton.classList.add('active');
    }
});

function filterBooksByGenre(genre) {
    const allBookCards = document.querySelectorAll('.book-grid .book-card'); // Get all book cards in the DOM
    
    allBookCards.forEach(card => {
        const cardGenre = card.dataset.genre;
        if (genre === 'All' || cardGenre === genre) {
            card.style.display = ''; // Show the book card
        } else {
            card.style.display = 'none'; // Hide the book card
        }
    });
}