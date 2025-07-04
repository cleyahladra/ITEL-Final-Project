// main.js
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const birthdate = document.getElementById("signupBirthdate").value;
    const phone = document.getElementById("signupPhone").value.trim();

    try {
      await addDoc(collection(db, "users"), {
        username,
        password,
        email,
        birthdate,
        phone,
        createdAt: new Date()
      });

      alert("✅ Sign-up successful!");
      signupForm.reset();

      document.getElementById("signupPage").classList.remove("active");
      document.getElementById("loginPage").classList.add("active");
    } catch (error) {
      console.error("❌ Error saving user:", error);
      alert("❌ Could not complete sign-up.");
    }
  });

  // Toggle login/signup
  document.getElementById("showSignup").addEventListener("click", () => {
    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("signupPage").classList.add("active");
  });

  document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("signupPage").classList.remove("active");
    document.getElementById("loginPage").classList.add("active");
  });
});
