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
    { id: "system-2", title: "1984", author: "George Orwell", content: "A dystopian social science fiction novel by English author George Orwell. Published on 8 June 1949 by Secker & Warburg, it is set in Airstrip One (formerly Great Britain), a province of the superstate Oceania, where the Party maintains power through surveillance, propaganda, and repression.", imageUrl: "https://i.ibb.co/pvrQLYdr/novel-1984.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-3", title: "Pride and Prejudice", author: "Jane Austen", content: "A romantic novel of manners written by Jane Austen in 1813. The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, absence, and marriage in the society of the landed gentry of the British Regency.", imageUrl: "https://i.ibb.co/gb2wKZxq/Pride-and-Prejudice.jpg", creatorId: "system", genre: "romance" },
    { id: "system-4", title: "To Kill a Mockingbird", author: "Harper Lee", content: "A novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.", imageUrl: "https://i.ibb.co/CpdnC4wR/To-Kill-a-Mockingbird.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-5", title: "The Great Gatsby", author: "F. Scott Fitzgerald", content: "A novel illustrating the Jazz Age.", imageUrl: "https://i.ibb.co/YFKKhCXc/boook-the-great-gatsby.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-6", title: "Dune", author: "Frank Herbert", content: "A science fiction novel set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs.", imageUrl: "https://i.ibb.co/7xYX1jmw/Dune.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-7", title: "Murder on the Orient Express", author: "Agatha Christie", content: "A detective novel by the English writer Agatha Christie, featuring the Belgian detective Hercule Poirot.", imageUrl: "https://i.ibb.co/BHDwJ1j3/Murder-on-the-Orient-Express.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-8", title: "The Silent Patient", author: "Alex Michaelides", content: "A shocking psychological thriller about a woman's act of violence against her husband—and the psychotherapist obsessed with uncovering what happened.", imageUrl: "https://i.ibb.co/ks82Xhx4/silent.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-9", title: "Educated", author: "Tara Westover", content: "An American memoir by Tara Westover, published in February 2018. It tells the story of her journey from growing up in a fundamentalist Mormon household in rural Idaho to earning a PhD at Cambridge University.", imageUrl: "https://i.ibb.co/fb4M1LQ/Educated.jpg", creatorId: "system", genre: "biography" },
    { id: "system-10", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", content: "A book by Yuval Noah Harari, first published in Hebrew in 2011 and in English in 2014. It surveys the history of humankind from the Stone Age up to the twenty-first century.", imageUrl: "https://i.ibb.co/Q3jbPswh/sapiens.png", creatorId: "system", genre: "history" },
    { id: "system-11", title: "Atomic Habits", author: "James Clear", content: "An American self-help book by James Clear. It offers a practical framework for improving every day.", imageUrl: "https://i.ibb.co/G6Pq7M9/Atomic-Habits.jpg", creatorId: "system", genre: "self-help" },
    { id: "system-12", title: "The Alchemist", author: "Paulo Coelho", content: "An allegorical novel by Brazilian author Paulo Coelho, first published in 1988. It's about a young shepherd who journeys from his homeland in Spain to the Egyptian desert in search of a treasure.", imageUrl: "https://i.ibb.co/9zm6b7S/Alchemist-story-novel.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-13", title: "The Lord of the Rings", author: "J.R.R. Tolkien", content: "An epic high-fantasy novel. Follows Frodo Baggins on a quest to destroy the One Ring.", imageUrl: "https://i.ibb.co/MyV0T9KF/The-Lord-of-the-Rings.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-14", title: "Foundation", author: "Isaac Asimov", content: "A science fiction novel that is the first of the Foundation series. Chronicles the decline of the Galactic Empire.", imageUrl: "https://i.ibb.co/jPxPSJF1/Foundation-book-bnovel.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-15", title: "The Da Vinci Code", author: "Dan Brown", content: "A mystery thriller novel. Follows symbologist Robert Langdon and cryptologist Sophie Neveu as they investigate a murder in Paris.", imageUrl: "https://i.ibb.co/bgcgDxS4/Da-Vinci.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-16", title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", content: "A comedy science fiction series created by Douglas Adams. Follows the adventures of Arthur Dent after the destruction of Earth.", imageUrl: "https://i.ibb.co/6RsLmCv8/The-Hitchhiker-s-Guide-to-the-Galaxy.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-17", title: "Sense and Sensibility", author: "Jane Austen", content: "A novel by Jane Austen. Explores the Dashwood sisters' experiences with love, romance, and heartbreak.", imageUrl: "https://i.ibb.co/7JrBMSBv/Sense-and-Sensibility.jpg", creatorId: "system", genre: "romance" },
    { id: "system-18", title: "Crime and Punishment", author: "Fyodor Dostoevsky", content: "A novel by Fyodor Dostoevsky. Focuses on the mental anguish and moral dilemmas of Rodion Raskolnikov, a former student.", imageUrl: "https://i.ibb.co/1t1FdX35/Crime-and-Punishment.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-19", title: "The Picture of Dorian Gray", author: "Oscar Wilde", content: "A philosophical novel by Oscar Wilde. Tells of a young man whose portrait ages while he remains young and beautiful.", imageUrl: "https://i.ibb.co/QvfntRrp/The-Picture-of-Dorian-Gray.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-20", title: "Frankenstein", author: "Mary Shelley", content: "A novel by Mary Shelley. Deals with themes of ambition, creation, and responsibility.", imageUrl: "https://i.ibb.co/SXw7fn3q/Frankenstein.jpg", creatorId: "system", genre: "horror" },
    { id: "system-21", title: "Dracula", author: "Bram Stoker", content: "A Gothic horror novel by Irish author Bram Stoker. Introduces the character of Count Dracula.", imageUrl: "https://i.ibb.co/Ld6Ct5bJ/Dracula.jpg", creatorId: "system", genre: "horror" },
    { id: "system-22", title: "The Odyssey", author: "Homer", content: "One of two major ancient Greek epic poems attributed to Homer. Recounts the journey of Odysseus back to Ithaca.", imageUrl: "https://i.ibb.co/bjX28ZYg/The-Odyssey.jpg", creatorId: "system", genre: "classic" },
    { id: "system-23", title: "Don Quixote", author: "Miguel de Cervantes", content: "A Spanish novel by Miguel de Cervantes. Tells the story of a hidalgo who reads too many chivalric romances.", imageUrl: "https://i.ibb.co/zTPj0ZX9/Don-Quixote.jpg", creatorId: "system", genre: "classic" },
    { id: "system-24", title: "Moby Dick", author: "Herman Melville", content: "A novel by Herman Melville. Explores the obsessive quest of Captain Ahab for the white whale, Moby Dick.", imageUrl: "https://i.ibb.co/PGMJCXg9/Moby-Dick.jpg", creatorId: "system", genre: "classic" },
    { id: "system-25", title: "War and Peace", author: "Leo Tolstoy", content: "A novel by the Russian author Leo Tolstoy. Chronicles the history of the French invasion of Russia.", imageUrl: "https://i.ibb.co/PvDtjQJP/war-and-peace.jpg", creatorId: "system", genre: "classic" },
    { id: "system-26", title: "The Catcher in the Rye", author: "J.D. Salinger", content: "A novel by J. D. Salinger. Explores themes of alienation and innocence.", imageUrl: "https://i.ibb.co/KcM6HKHq/The-Catcher-in-the-Rye.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-27", title: "The Grapes of Wrath", author: "John Steinbeck", content: "A novel by John Steinbeck. Depicts the struggles of an Oklahoman family during the Dust Bowl.", imageUrl: "https://i.ibb.co/mr9rX26S/The-Grapes-of-Wrath.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-28", title: "Brave New World", author: "Aldous Huxley", content: "A dystopian novel by Aldous Huxley. Explores a future world where human reproduction is controlled.", imageUrl: "https://i.ibb.co/hxdzZDr2/Brave-New-World.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-29", title: "The Martian", author: "Andy Weir", content: "A science fiction novel by Andy Weir. Follows an astronaut stranded on Mars.", imageUrl: "https://i.ibb.co/NdJg6jkP/The-Martian.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-30", title: "Project Hail Mary", author: "Andy Weir", content: "A science fiction novel by Andy Weir. Follows an amnesiac astronaut on a mission to save humanity.", imageUrl: "https://i.ibb.co/xtNczDNN/Project-Hail-Mary.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-31", title: "The Hunger Games", author: "Suzanne Collins", content: "A dystopian novel by Suzanne Collins. Follows Katniss Everdeen as she fights for survival.", imageUrl: "https://i.ibb.co/ccrV0wnb/The-Hunger-Games.jpg", creatorId: "system", genre: "young adult" },
    { id: "system-32", title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", content: "The first novel in the Harry Potter series. Follows Harry Potter's first year at Hogwarts.", imageUrl: "https://i.ibb.co/fzq1Nvv1/Harry-Potter-and-the-Sorcerer-s-Stone.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-33", title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", content: "A fantasy novel that is the first published and best known of the seven novels in The Chronicles of Narnia.", imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1661032875i/11127.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-34", title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", content: "A psychological thriller novel. Investigates the disappearance of a wealthy girl.", imageUrl: "https://i.ibb.co/6RjZ8p5J/The-Girl-with-the-Dragon-Tattoo.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-35", title: "Gone Girl", author: "Gillian Flynn", content: "A psychological thriller novel by Gillian Flynn. Explores the disappearance of a woman on her fifth wedding anniversary.", imageUrl: "https://i.ibb.co/1YDDzNL5/Gone-Girl.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-36", title: "The Silent Corner", author: "Dean Koontz", content: "A thriller novel. A woman discovers her husband's secret life after his death.", imageUrl: "https://i.ibb.co/C50wSY4f/The-Silent-Corner.jpg", creatorId: "system", genre: "thriller" },
    { id: "system-37", title: "The Guest List", author: "Lucy Fokley", content: "A mystery thriller novel. A wedding turns deadly on a remote Irish island.", imageUrl: "https://i.ibb.co/ksj0cx58/The-Guest-List.png", creatorId: "system", genre: "mystery" },
    { id: "system-38", title: "Big Little Lies", author: "Liane Moriarty", content: "A novel about secrets and lies among a group of mothers.", imageUrl: "https://i.ibb.co/mCJL6F4T/Big-Little-Lies.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-39", title: "And Then There Were None", author: "Agatha Christie", content: "A mystery novel. Ten strangers are invited to an isolated island and murdered one by one.", imageUrl: "https://i.ibb.co/Gf3kVY7f/And-Then-There-Were-None.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-40", title: "The Woman in Cabin 10", author: "Ruth Ware", content: "A mystery thriller novel. A journalist witnesses a body thrown overboard on a luxury cruise.", imageUrl: "https://i.ibb.co/C5Zsjq1d/The-Woman-in-Cabin-10.jpg", creatorId: "system", genre: "mystery" },
    { id: "system-41", title: "Where the Crawdads Sing", author: "Delia Owens", content: "A coming-of-age story and a murder mystery.", imageUrl: "https://i.ibb.co/4B7xgRz/Where-the-Crawdads-Sing.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-42", title: "The Nightingale", author: "Kristin Hannah", content: "A historical fiction novel set during World War II.", imageUrl: "https://i.ibb.co/pvz7yJJF/The-Nightingale.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-43", title: "All the Light We Cannot See", author: "Anthony Doerr", content: "A historical fiction novel set during World War II. Follows a blind French girl and a young German soldier.", imageUrl: "https://i.ibb.co/S70Kx4KD/All-the-Light-We-Cannot-See.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-44", title: "The Book Thief", author: "Markus Zusak", content: "A historical novel about a young girl living in Nazi Germany.", imageUrl: "https://i.ibb.co/39bKfXGv/The-Book-Thief.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-45", title: "Circe", author: "Madeline Miller", content: "A mythological fiction novel. Retells the story of Circe, a goddess in Greek mythology.", imageUrl: "https://i.ibb.co/CsNLbHkY/Circe.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-46", title: "The Song of Achilles", author: "Madeline Miller", content: "A historical and mythological fiction novel. Retells the Trojan War through the eyes of Patroclus.", imageUrl: "https://i.ibb.co/B2RfZnmt/The-Song-of-Achilles.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-47", title: "Red, White & Royal Blue", author: "Casey McQuiston", content: "A contemporary romance novel about the First Son of the United States and a British prince.", imageUrl: "https://i.ibb.co/93yKZLBP/Red-White-Royal-Blue.jpg", creatorId: "system", genre: "romance" },
    { id: "system-48", title: "The Kiss Quotient", author: "Helen Hoang", content: "A contemporary romance novel about a woman with Asperger's syndrome who hires a male escort to teach her about intimacy.", imageUrl: "https://i.ibb.co/7J4K5xYd/The-Kiss-Quotient.jpg", creatorId: "system", genre: "romance" },
    { id: "system-49", title: "The Love Hypothesis", author: "Ali Hazelwood", content: "A contemporary romance novel about a fake relationship between a Ph.D. student and a professor.", imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1747519081i/56732449.jpg", creatorId: "system", genre: "romance" },
    { id: "system-50", title: "Beach Read", author: "Emily Henry", content: "A contemporary romance novel about two writers with writer's block who swap genres.", imageUrl: "https://i.ibb.co/0pfxCrkX/Beach-Read.jpg", creatorId: "system", genre: "romance" },
    { id: "system-51", title: "A Court of Thorns and Roses", author: "Sarah J. Maas", content: "A fantasy novel that blends beauty and the beast with fae lore.", imageUrl: "https://i.ibb.co/RTMJBQ9Y/A-Court-of-Thorns-and-Roses.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-52", title: "From Blood and Ash", author: "Jennifer L. Armentrout", content: "A fantasy romance novel with vampires and forbidden love.", imageUrl: "https://i.ibb.co/KzqPcdgv/From-Blood-and-Ash.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-53", title: "Mistborn: The Final Empire", author: "Brandon Sanderson", content: "A high fantasy novel. Follows a group of rebels trying to overthrow an evil empire.", imageUrl: "https://i.ibb.co/RkRDrNJv/Mist-Born.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-54", title: "Name of the Wind", author: "Patrick Rothfuss", content: "A fantasy novel that tells the story of Kvothe, an infamous magician and adventurer.", imageUrl: "https://i.ibb.co/r2spcRZ7/Name-of-the-Wind.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-55", title: "The Blade Itself", author: "Joe Abercrombie", content: "A grimdark fantasy novel, first in The First Law trilogy.", imageUrl: "https://i.ibb.co/2YjK3NRx/The-Blade-Itself.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-56", title: "American Gods", author: "Neil Gaiman", content: "A fantasy novel. Explores the conflict between Old Gods and New Gods in America.", imageUrl: "https://i.ibb.co/3m85tHXG/American-Gods.jpg ", creatorId: "system", genre: "fantasy" },
    { id: "system-57", title: "Good Omens", author: "Terry Pratchett & Neil Gaiman", content: "A comedic fantasy novel about an angel and a demon trying to prevent the apocalypse.", imageUrl: "https://i.ibb.co/Z6YHnwB3/Good-Omens.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-58", title: "Jonathan Strange & Mr Norrell", author: "Susanna Clarke", content: "An alternative history novel. Explores a magical alternative 19th-century England.", imageUrl: "https://i.ibb.co/G4d5W85z/Jonathan.png", creatorId: "system", genre: "fantasy" },
    { id: "system-59", title: "The Priory of the Orange Tree", author: "Samantha Shannon", content: "A high fantasy novel with dragons and queens.", imageUrl: "https://i.ibb.co/QhdbxSK/The-Priory-of-the-Orange-Tree.jpg ", creatorId: "system", genre: "fantasy" },
    { id: "system-60", title: "The Poppy War", author: "R.F. Kuang", content: "An epic fantasy novel inspired by Chinese history.", imageUrl: "https://i.ibb.co/nMk7yrFj/The-Poppy-War.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-61", title: "Neverwhere", author: "Neil Gaiman", content: "A fantasy novel set in a magical realm coexisting with London.", imageUrl: "https://i.ibb.co/8nSvzjxG/Neverwhere.jpg ", creatorId: "system", genre: "fantasy" },
    { id: "system-62", title: "Stardust", author: "Neil Gaiman", content: "A fantasy novel about a young man's quest to retrieve a fallen star.", imageUrl: "https://i.ibb.co/TxtfvVMp/Stardust.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-63", title: "Mythos", author: "Stephen Fry", content: "A retelling of Greek myths.", imageUrl: "https://i.ibb.co/BHh2VpNt/Mythos.jpg", creatorId: "system", genre: "mythology" },
    { id: "system-64", title: "Norse Mythology", author: "Neil Gaiman", content: "A retelling of Norse myths.", imageUrl: "https://i.ibb.co/ynR23vrd/norse.jpg", creatorId: "system", genre: "mythology" },
    { id: "system-65", title: "The Hero with a Thousand Faces", author: "Joseph Campbell", content: "A non-fiction book about comparative mythology. Introduces the concept of the monomyth.", imageUrl: "https://i.ibb.co/VYc2D1Hp/The-Hero-with-a-Thousand-Faces.jpg", creatorId: "system", genre: "mythology" },
    { id: "system-66", title: "Astrophysics for People in a Hurry", author: "Neil deGrasse Tyson", content: "A non-fiction book about astrophysics.", imageUrl: "https://i.ibb.co/5xvxPpk6/Astrophysics-for-People-in-a-Hurry.jpg", creatorId: "system", genre: "science" },
    { id: "system-67", title: "Cosmos", author: "Carl Sagan", content: "A non-fiction book about science and the universe.", imageUrl: "https://i.ibb.co/h1yY51vd/Cosmos.jpg", creatorId: "system", genre: "science" },
    { id: "system-68", title: "The Art of War", author: "Sun Tzu", content: "An ancient Chinese military treatise.", imageUrl: "https://i.ibb.co/NnT5q91f/The-Art-of-War.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-69", title: "Meditations", author: "Marcus Aurelius", content: "A series of personal writings by Marcus Aurelius, Roman Emperor, expressing his ideas on Stoic philosophy.", imageUrl: "https://i.ibb.co/FL3k6t6V/Meditations.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-70", title: "Thus Spoke Zarathustra", author: "Friedrich Nietzsche", content: "A philosophical novel by Friedrich Nietzsche, concerning the ideas of the 'eternal recurrence of the same' and the 'will to power'.", imageUrl: "https://i.ibb.co/6cxf9q13/Thus-Spoke-Zarathustra.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-71", title: "The Prince", author: "Niccolò Machiavelli", content: "A 16th-century political treatise by the Italian diplomat and political theorist Niccolò Machiavelli.", imageUrl: "https://i.ibb.co/kVvdNC6R/The-Prince.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-72", title: "Critique of Pure Reason", author: "Immanuel Kant", content: "A foundational work in Western philosophy.", imageUrl: "https://i.ibb.co/HLGfhWTr/Critique-of-Pure-Reason.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-73", title: "The Republic", author: "Plato", content: "A Socratic dialogue by Plato concerning justice, the order and character of the just city-state, and the just man.", imageUrl: "https://i.ibb.co/dJ4sTkvQ/republic.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-74", title: "Beyond Good and Evil", author: "Friedrich Nietzsche", content: "A book by Friedrich Nietzsche that traces the origins of morality.", imageUrl: "https://i.ibb.co/PvQ485zJ/Beyond-Good-and-Evil.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-75", title: "Fear and Trembling", author: "Søren Kierkegaard", content: "A philosophical work by Søren Kierkegaard.", imageUrl: "https://i.ibb.co/fYdKpkJB/Fear-and-Trembling.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-76", title: "Walden", author: "Henry David Thoreau", content: "A reflection upon simple living in natural surroundings.", imageUrl: "https://i.ibb.co/hRdqQcSJ/Walden.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-77", title: "The Analects of Confucius", author: "Confucius", content: "A collection of sayings and ideas attributed to the Chinese philosopher Confucius.", imageUrl: "https://i.ibb.co/Fkp3v5Hb/The-Analects-of-Confucius.jpg", creatorId: "system", genre: "philosophy" },
    { id: "system-78", title: "The History of the Peloponnesian War", author: "Thucydides", content: "A historical account of the Peloponnesian War.", imageUrl: "https://i.ibb.co/gbmC4mbP/The-History-of-the-Peloponnesian-War.jpg", creatorId: "system", genre: "history" },
    { id: "system-79", title: "Guns, Germs, and Steel", author: "Jared Diamond", content: "A non-fiction book about the factors that have shaped human history.", imageUrl: "https://i.ibb.co/svm0bCNH/Guns-Germs-and-Steel.jpg", creatorId: "system", genre: "history" },
    { id: "system-80", title: "A People's History of the United States", author: "Howard Zinn", content: "A non-fiction book by Howard Zinn, presenting a multi-sided view of American history.", imageUrl: "https://i.ibb.co/5gmskJ2N/A-People-s-History-of-the-United-States.jpg", creatorId: "system", genre: "history" },
    { id: "system-81", title: "The Diary of a Young Girl", author: "Anne Frank", content: "The diary of Anne Frank, a Jewish girl who hid with her family during the Holocaust.", imageUrl: "https://i.ibb.co/B2rD6fSG/The-Diary-of-a-Young-Girl.jpg", creatorId: "system", genre: "biography" },
    { id: "system-82", title: "Long Walk to Freedom", author: "Nelson Mandela", content: "An autobiography of Nelson Mandela, detailing his early life, coming of age, education and 27 years in prison.", imageUrl: "https://i.ibb.co/sZ25CZs/Long-Walk-to-Freedom.jpg", creatorId: "system", genre: "biography" },
    { id: "system-83", title: "Steve Jobs", author: "Walter Isaacson", content: "A biography of Steve Jobs, co-founder of Apple Inc.", imageUrl: "https://i.ibb.co/HTNJgBLT/Steve-Jobs.jpg", creatorId: "system", genre: "biography" },
    { id: "system-84", title: "Becoming", author: "Michelle Obama", content: "A memoir by former First Lady of the United States Michelle Obama.", imageUrl: "https://i.ibb.co/4nCyGb66/Becoming.jpg", creatorId: "system", genre: "biography" },
    { id: "system-85", title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", content: "A non-fiction book about Henrietta Lacks and the HeLa cell line.", imageUrl: "https://i.ibb.co/Ngvz4DJz/The-Immortal-Life-of-Henrietta-Lacks.jpg", creatorId: "system", genre: "biography" },
    { id: "system-86", title: "Into Thin Air", author: "Jon Krakauer", content: "A non-fiction book about the 1996 Mount Everest disaster.", imageUrl: "https://i.ibb.co/0VJxJtH3/Into-Thin-Air.jpg", creatorId: "system", genre: "adventure" },
    { id: "system-87", title: "Wild", author: "Cheryl Strayed", content: "A memoir about a woman's 1,100-mile hike on the Pacific Crest Trail.", imageUrl: "https://i.ibb.co/MDKMJ7vc/Wild.jpg", creatorId: "system", genre: "adventure" },
    { id: "system-88", title: "The Secret History", author: "Donna Tartt", content: "A novel about a group of classics students at a New England college.", imageUrl: "https://i.ibb.co/JW1rwDqQ/The-Secret-History.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-89", title: "Atonement", author: "Ian McEwan", content: "A novel that spans several decades, beginning in 1935 England.", imageUrl: "https://i.ibb.co/Df7pYSQ0/Atonement.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-90", title: "Cloud Atlas", author: "David Mitchell", content: "A novel composed of six nested stories that take the reader from the South Pacific in the 19th century to a post-apocalyptic future.", imageUrl: "https://i.ibb.co/q3bFw6zj/Cloud-Atlas.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-91", title: "Life of Pi", author: "Yann Martel", content: "A fantasy adventure novel about a boy shipwrecked with a Bengal tiger.", imageUrl: "https://i.ibb.co/jZ3rHgpK/Life-of-Pi.jpg", creatorId: "system", genre: "adventure" },
    { id: "system-92", title: "The Road", author: "Cormac McCarthy", content: "A post-apocalyptic novel about a father and son's journey.", imageUrl: "https://i.ibb.co/fY0bvrpx/The-Road.jpg", creatorId: "system", genre: "post-apocalyptic" },
    { id: "system-93", title: "Blindness", author: "José Saramago", content: "A novel about a city struck by an epidemic of white blindness.", imageUrl: "https://i.ibb.co/HDxZJH2L/Blindness.jpg", creatorId: "system", genre: "dystopian" },
    { id: "system-94", title: "The Handmaid's Tale", author: "Margaret Atwood", content: "A dystopian novel set in a totalitarian society.", imageUrl: "https://i.ibb.co/rRgXtqJJ/The-Handmaid-s-Tale.jpg", creatorId: "system", genre: "dystopian" },
    { id: "system-95", title: "Fahrenheit 451", author: "Ray Bradbury", content: "A dystopian novel where books are outlawed and burned.", imageUrl: "https://i.ibb.co/20Wxx4M2/Fahrenheit-451.jpg", creatorId: "system", genre: "dystopian" },
    { id: "system-96", title: "The Name of the Rose", author: "Umberto Eco", content: "A historical murder mystery set in a medieval monastery.", imageUrl: "https://i.ibb.co/JW7vgxSY/The-Name-of-the-Rose.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-97", title: "The Pillars of the Earth", author: "Ken Follett", content: "A historical novel set in 12th-century England during the building of a cathedral.", imageUrl: "https://i.ibb.co/N2krNzGF/The-Pillars-of-the-Earth.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-98", title: "Shogun", author: "James Clavell", content: "A historical novel set in feudal Japan.", imageUrl: "https://i.ibb.co/wNJgcsNC/Shogun.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-99", title: "Outlander", author: "Diana Gabaldon", content: "A historical romance novel about a World War II nurse who travels back in time to 18th-century Scotland.", imageUrl: "https://i.ibb.co/yn0MRL5Y/Outlander.jpg", creatorId: "system", genre: "historical romance" },
    { id: "system-100", title: "The Midnight Library", author: "Matt Haig", content: "A fantasy novel about a woman who gets a chance to explore alternate lives.", imageUrl: "https://i.ibb.co/qMcZwq1k/The-Midnight-Library.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-101", title: "Entangled Life", author: "Merlin Sheldrake", content: "A non-fiction book about fungi and their impact on the world.", imageUrl: "https://i.ibb.co/nq6zRRv1/Entangled-Life.jpg", creatorId: "system", genre: "science" },
    { id: "system-102", title: "A Brief History of Humankind", author: "Yuval Noah Harari", content: "A comprehensive overview of human history from the Stone Age to the 21st century.", imageUrl: "https://i.ibb.co/jvMSJT0w/A-Brief-History-of-Humankind.jpg", creatorId: "system", genre: "history" },
    { id: "system-103", title: "Homo Deus: A Brief History of Tomorrow", author: "Yuval Noah Harari", content: "Explores projects, dreams and nightmares that will shape the 21st century—from overcoming death to creating artificial life.", imageUrl: "https://i.ibb.co/B54RZpbQ/Homo-Deus.jpg", creatorId: "system", genre: "future studies" },
    { id: "system-104", title: "21 Lessons for the 21st Century", author: "Yuval Noah Harari", content: "A book that explores some of the most pressing issues of the current global landscape.", imageUrl: "https://i.ibb.co/67YbdmBb/21-Lessons-for-the-21st-Century.png", creatorId: "system", genre: "current affairs" },
    { id: "system-105", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", content: "A best-selling non-fiction book by Daniel Kahneman, which summarizes research on cognitive biases.", imageUrl: "https://i.ibb.co/KcK85XNm/Thinking-Fast-and-Slow.jpg", creatorId: "system", genre: "psychology" },
    { id: "system-106", title: "Influence: The Psychology of Persuasion", author: "Robert B. Cialdini", content: "A book on persuasion and marketing.", imageUrl: "https://i.ibb.co/674K9QwZ/Influence.jpg", creatorId: "system", genre: "psychology" },
    { id: "system-107", title: "The Power of Habit", author: "Charles Duhigg", content: "A book that explores the science behind habit creation and reformation.", imageUrl: "https://i.ibb.co/Txy51gTw/The-Power-of-Habit.png", creatorId: "system", genre: "self-help" },
    { id: "system-108", title: "Mindset: The New Psychology of Success", author: "Carol S. Dweck", content: "A book on the power of believing that you can improve.", imageUrl: "https://i.ibb.co/G4NVk9qR/Mindset.jpg", creatorId: "system", genre: "psychology" },
    { id: "system-109", title: "Grit: The Power of Passion and Perseverance", author: "Angela Duckworth", content: "A book about the importance of passion and perseverance to achieve long-term goals.", imageUrl: "https://i.ibb.co/67n01nmw/Grit.png", creatorId: "system", genre: "self-help" },
    { id: "system-110", title: "Quiet: The Power of Introverts in a World That Can't Stop Talking", author: "Susan Cain", content: "A non-fiction book about introversion.", imageUrl: "https://i.ibb.co/VWXV2zq9/Quiet.jpg", creatorId: "system", genre: "psychology" },
    { id: "system-111", title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", content: "A business and self-help book.", imageUrl: "https://i.ibb.co/9QNDWG8/The-7-Habits.jpg", creatorId: "system", genre: "self-help" },
    { id: "system-112", title: "The Martian", author: "Andy Weir", content: "A science fiction novel about an astronaut presumed dead and left behind on Mars.", imageUrl: "https://i.ibb.co/8LGvBXg3/The-Martian.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-113", title: "Artemis", author: "Andy Weir", content: "A science fiction heist novel set on the Moon.", imageUrl: "https://i.ibb.co/gH9q5p9/Artemis.jpg", creatorId: "system", genre: "science fiction" },
    { id: "system-114", title: "The Midnight Library", author: "Matt Haig", content: "A fantasy novel about a woman who gets a chance to explore alternate lives.", imageUrl: "https://i.ibb.co/TxrnxQP5/The-Midnight-Library.jpg", creatorId: "system", genre: "fantasy" },
    { id: "system-115", title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman", content: "A contemporary fiction novel about a socially awkward woman who finds friendship.", imageUrl: "https://i.ibb.co/F4w3SbQX/Eleanor-Oliphant.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-116", title: "Normal People", author: "Sally Rooney", content: "A contemporary fiction novel about the intricate relationship between two young people.", imageUrl: "https://i.ibb.co/BVbXhL97/Normal-People.jpg", creatorId: "system", genre: "fiction" },
    { id: "system-117", title: "The Vanishing Half", author: "Brit Bennett", content: "A historical fiction novel about twin sisters who choose to live in very different worlds.", imageUrl: "https://i.ibb.co/wNCZRW7c/The-Vanishing-Half.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-118", title: "Pachinko", author: "Min Jin Lee", content: "A historical fiction novel following a Korean family who immigrates to Japan.", imageUrl: "https://i.ibb.co/fV1dJkfh/Pachinko.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-119", title: "Hamnet", author: "Maggie O'Farrell", content: "A historical fiction novel imagining the life of Shakespeare's wife, Agnes Hathaway.", imageUrl: "https://i.ibb.co/vxpJDVCc/Hamnet.jpg", creatorId: "system", genre: "historical fiction" },
    { id: "system-120", title: "Project Hail Mary", author: "Andy Weir", content: "A science fiction novel about an amnesiac astronaut on a mission to save humanity.", imageUrl: "https://i.ibb.co/Q3wLFGxV/Project-Hail-Mary.jpg", creatorId: "system", genre: "science fiction" },
];

function createBookCard(book, isFavorite = false, isHistory = false) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.setAttribute('data-id', book.id);

    const bookImage = document.createElement('img');
    bookImage.src = book.imageUrl;
    bookImage.alt = book.title;
    bookCard.appendChild(bookImage);

    const bookTitle = document.createElement('h3');
    bookTitle.textContent = book.title;
    bookCard.appendChild(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.textContent = book.author;
    bookCard.appendChild(bookAuthor);

    const genreTag = document.createElement('span');
    genreTag.className = 'genre-tag';
    genreTag.textContent = book.genre;
    bookCard.appendChild(genreTag);

    // Favorite button
    const favoriteStar = document.createElement('span');
    favoriteStar.className = 'favorite-star';
    favoriteStar.innerHTML = isFavorite ? ' ❤️ ' : ' ♡ '; // Filled heart for favorite, outline for not
    favoriteStar.onclick = (e) => {
        e.stopPropagation(); // Prevent opening modal when clicking star
        toggleFavorite(book.id, isFavorite);
    };
    bookCard.appendChild(favoriteStar);

    // Show edit/delete only for non-system books
    if (book.creatorId !== "system" && currentUser && book.creatorId === currentUser.uid) {
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'action-button edit-button';
        editButton.onclick = (e) => {
            e.stopPropagation();
            window.editBook(book.id, book.title, book.author, book.content, book.imageUrl, book.genre);
        };
        bookCard.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'action-button delete-button';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            window.deleteBook(book.id);
        };
        bookCard.appendChild(deleteButton);
    }

    // Add click event listener to open the book content modal
    bookCard.addEventListener('click', () => openBookContentModal(book, isHistory));

    return bookCard;
}

// Function to open book content modal and add to history
async function openBookContentModal(book, isHistory) {
    modalBookTitle.textContent = book.title;
    modalBookAuthor.textContent = `by ${book.author}`;
    modalBookContent.textContent = book.content;
    bookContentModal.style.display = 'flex'; // Use flex to center the modal

    // Add to reading history if it's not already in history (prevents duplicates on re-opening)
    if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        let readingHistory = userData.readingHistory || [];

        // Check if the book is already in history
        const isAlreadyInHistory = readingHistory.some(historyBook => historyBook.id === book.id);

        if (!isAlreadyInHistory) {
            // Add the new book to the end of the history
            readingHistory.push(book);

            // If history exceeds 10, remove the oldest book
            if (readingHistory.length > 10) {
                readingHistory = readingHistory.slice(readingHistory.length - 10);
            }

            // Update Firestore with the new reading history
            await setDoc(userRef, { readingHistory: readingHistory }, { merge: true });
            loadBooks(); // Reload books to update the history display
        }
    }
}

modalCloseBtn.addEventListener('click', () => {
    bookContentModal.style.display = 'none';
});

window.onclick = (event) => {
    if (event.target === bookContentModal) {
        bookContentModal.style.display = 'none';
    }
};

export async function loadBooks() {
    // Clear current displays
    if (homeBookList) homeBookList.innerHTML = '';
    if (libraryBookList) libraryBookList.innerHTML = '';
    if (favoriteBookList) favoriteBookList.innerHTML = '';
    if (historyBookList) historyBookList.innerHTML = ''; // Clear history list

    const booksCol = collection(db, 'books');
    const q = query(booksCol, orderBy("title", "asc"));
    const bookSnapshot = await getDocs(q);
    const booksList = bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    window.loadedBooks = booksList; // Make books globally available for genre filtering


    // Fetch user-specific data
    let favoriteBookIds = [];
    let readingHistory = []; // Initialize readingHistory
    if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        favoriteBookIds = userData.favorites || [];
        readingHistory = userData.readingHistory || []; // Get reading history
    }

    // Make favoriteBookIds accessible globally (or pass it to filterBooksByGenre if needed)
    window.favoriteBookIds = favoriteBookIds;

    // Display all predefined books on home page initially, handled by genre filter
    filterBooksByGenre('all');

    // Display user's own books and populate favorite/history lists
    booksList.forEach(book => {
        // Filter books for the user's library (non-system books created by the current user)
        if (currentUser && book.creatorId === currentUser.uid) {
            const isFavorite = favoriteBookIds.some(favId => favId === book.id);
            if (libraryBookList) libraryBookList.appendChild(createBookCard(book, isFavorite));
        }
    });

    // Display favorite books
    const allBooks = [...predefinedBooks, ...booksList]; // Combine predefined and user-added books
    favoriteBookIds.forEach(favId => {
        const book = allBooks.find(b => b.id === favId);
        if (book) {
            if (favoriteBookList) favoriteBookList.appendChild(createBookCard(book, true));
        }
    });

    // Display reading history
    readingHistory.forEach(book => {
        // Check if the book exists in either predefined or user-added books to ensure full data
        const foundBook = allBooks.find(b => b.id === book.id);
        if (foundBook) {
            if (historyBookList) historyBookList.appendChild(createBookCard(foundBook, favoriteBookIds.includes(foundBook.id), true));
        } else {
            // If for some reason the book is not found (e.g., deleted), display minimal info or handle
            if (historyBookList) historyBookList.appendChild(createBookCard(book, favoriteBookIds.includes(book.id), true));
        }
    });
}

// ------------------------------
// 2 · Add new book (owner only)
// ------------------------------
if (addBookBtn) {
    addBookBtn.addEventListener('click', async () => {
        if (!currentUser) {
            window.showAlert("You must be logged in to add a book.");
            return;
        }

        const title = await window.showPrompt("Enter book title:");
        if (!title) return;

        const author = await window.showPrompt("Enter book author:");
        if (!author) return;

        const content = await window.showPrompt("Enter book content:");
        if (!content) return;

        const imageUrl = await window.showPrompt("Enter image URL (optional):");
        const genre = await window.showPrompt("Enter book genre (e.g., Fiction, Fantasy, Mystery):");
        if (!genre) return;

        const visibility = await window.showPrompt("Should this book be 'public' or 'private'?");
        if (!visibility || (visibility !== "public" && visibility !== "private")) {
            window.showAlert("Invalid visibility option. Book not added.");
            return;
        }

        await addDoc(collection(db, 'books'), {
            title: title.trim(),
            author: author.trim(),
            content: content.trim(),
            imageUrl: imageUrl ? imageUrl.trim() : '',
            genre: genre.trim().toLowerCase(),
            creatorId: currentUser.uid,
            visibility: visibility.trim().toLowerCase()
        });

        window.showAlert("Book added!");
        loadBooks();
    });
}

// Event listener for the "Publish Story" button on the write form
if (writeForm) {
    writeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!currentUser) {
            window.showAlert("You must be logged in to publish a story.");
            return;
        }

        const title = writeTitle.value;
        const author = writeAuthor.value;
        const genre = writeGenre.value;
        const imageUrl = writeImageUrl.value;
        const content = writeContent.value;

        if (!title || !author || !genre || !content) {
            window.showAlert("Please fill in all required fields (Title, Author, Genre, Content).");
            return;
        }

        const visibility = await window.showPrompt("Should this book be 'public' or 'private'?");
        if (!visibility || (visibility !== "public" && visibility !== "private")) {
            window.showAlert("Invalid visibility option. Story not published.");
            return;
        }

        await addDoc(collection(db, 'books'), {
            title: title.trim(),
            author: author.trim(),
            content: content.trim(),
            imageUrl: imageUrl ? imageUrl.trim() : '',
            genre: genre.trim().toLowerCase(),
            creatorId: currentUser.uid,
            visibility: visibility.trim().toLowerCase()
        });

        window.showAlert("Story published successfully!");

        writeTitle.value = '';
        writeAuthor.value = '';
        writeGenre.value = '';
        writeImageUrl.value = '';
        writeContent.value = '';

        loadBooks();

        document.getElementById('writePageContent').classList.add('hidden-page');
        document.getElementById('homePageContent').classList.remove('hidden-page');
        document.getElementById('homePageContent').classList.add('active-page');
    });
}

// ------------------------------
// 3 · Toggle Favorite
// ------------------------------
async function toggleFavorite(bookId, isCurrentlyFavorite) {
    if (!currentUser) {
        window.showAlert("You must be logged in to add to favorites.");
        return;
    }
    const userRef = doc(db, "users", currentUser.uid);
    if (isCurrentlyFavorite) {
        await updateDoc(userRef, {
            favorites: arrayRemove(bookId)
        });
        window.showAlert("Removed from favorites!");
    } else {
        await updateDoc(userRef, {
            favorites: arrayUnion(bookId)
        });
        window.showAlert("Added to favorites!");
    }
    loadBooks(); // Reload books to update favorite status
}
window.toggleFavorite = toggleFavorite; // Make it globally accessible

// ------------------------------
// 4 · Edit book (owner only)
// ------------------------------
window.editBook = async function (id, currentTitle, currentAuthor, currentContent, currentImageUrl, currentGenre) {
    const newTitle = await window.showPrompt("Enter new title:", currentTitle);
    if (newTitle === null) return;
    const newAuthor = await window.showPrompt("Enter new author:", currentAuthor);
    if (newAuthor === null) return;
    const newContent = await window.showPrompt("Enter new content:", currentContent);
    if (newContent === null) return;
    const newImageUrl = await window.showPrompt("Enter new image URL (optional):", currentImageUrl);
    if (newImageUrl === null) return;
    const newGenre = await window.showPrompt("Enter new genre:", currentGenre);
    if (newGenre === null) return;

    const bookRef = doc(db, "books", id);
    const snap = await getDoc(bookRef);
    if (!snap.exists()) {
        window.showAlert("Book not found.");
        return;
    }
    // Ensure current user is the creator
    if (!currentUser || currentUser.uid !== snap.data().creatorId) {
        window.showAlert("You do not have permission to edit this book.");
        return;
    }
    await updateDoc(bookRef, {
        title: newTitle.trim(),
        author: newAuthor.trim(),
        content: newContent.trim(),
        imageUrl: newImageUrl.trim(),
        genre: newGenre.trim().toLowerCase() // Update genre
    });
    window.showAlert("Book updated!");
    loadBooks();
};

// ------------------------------
// 5 · Delete book (owner only)
// ------------------------------
window.deleteBook = async function (id) {
    const confirmed = await window.showConfirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    const bookRef = doc(db, "books", id);
    const snap = await getDoc(bookRef);
    if (!snap.exists()) {
        window.showAlert("Book not found.");
        return;
    }
    // Ensure the book is not a 'system' book and current user is the creator
    if (!currentUser || currentUser.uid !== snap.data().creatorId || snap.data().creatorId === "system") {
        window.showAlert("You do not have permission to delete this book.");
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
});

function filterBooksByGenre(genre) {
    const allBooks = [...predefinedBooks];

    if (window.loadedBooks) {
        window.loadedBooks.forEach(book => {
            // Only include books that are public
            if (book.visibility === 'public') {
                allBooks.push(book);
            }
        });
    }

    if (homeBookList) homeBookList.innerHTML = ''; // Clear display
    allBooks.forEach(book => {
        const isFavorite = window.favoriteBookIds ? window.favoriteBookIds.includes(book.id) : false;
        if (genre === 'all' || book.genre.toLowerCase() === genre) {
            homeBookList.appendChild(createBookCard(book, isFavorite));
        }
    });
}
