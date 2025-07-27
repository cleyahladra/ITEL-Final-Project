// profile.js
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

window.addEventListener("DOMContentLoaded", () => {
    const db = getFirestore();
    const auth = getAuth();
    let userProfile = {};

    const profileName = document.getElementById("profileName");
    const profileSchool = document.getElementById("profileSchool");
    const profileAddress = document.getElementById("profileAddress");
    const profileYearLevel = document.getElementById("profileYearLevel");
    const profileContact = document.getElementById("profileContact");
    const editProfileBtn = document.getElementById("editProfileButton");

    function renderProfile() {
        if (profileName) profileName.textContent = userProfile.name || 'N/A';
        if (profileSchool) profileSchool.textContent = userProfile.school || 'N/A';
        if (profileAddress) profileAddress.textContent = userProfile.address || 'N/A';
        if (profileYearLevel) profileYearLevel.textContent = userProfile.yearLevel || 'N/A';
        if (profileContact) profileContact.textContent = userProfile.contact || 'N/A';
    }

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                userProfile = snap.data();
            } else {
                userProfile = {
                    uid: user.uid,
                    name: "",
                    school: "",
                    address: "",
                    yearLevel: "",
                    contact: "",
                    readingHistory: [], 
                    favorites: [] 
                };
                await setDoc(userRef, userProfile);
            }
            renderProfile();
        }
    });

    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", async () => {
            const n = await window.showPrompt("Enter new Student's Name:", userProfile.name);
            if (n !== null) userProfile.name = n.trim();
            const s = await window.showPrompt("Enter new School:", userProfile.school);
            if (s !== null) userProfile.school = s.trim();
            const a = await window.showPrompt("Enter new Address:", userProfile.address);
            if (a !== null) userProfile.address = a.trim();
            const y = await window.showPrompt("Enter new Year Level:", userProfile.yearLevel);
            if (y !== null) userProfile.yearLevel = y.trim();
            const c = await window.showPrompt("Enter new Contact Number:", userProfile.contact);
            if (c !== null) userProfile.contact = c.trim();

            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                try {
                    await setDoc(userRef, userProfile, { merge: true }); 
                    window.showAlert("Profile updated successfully!");
                    renderProfile(); 
                } catch (error) {
                    console.error("Error updating user profile in Firestore:", error);
                    window.showAlert("Error updating profile: " + error.message);
                }
            } else {
                window.showAlert("You must be logged in to edit your profile.");
            }
        });
    }
});