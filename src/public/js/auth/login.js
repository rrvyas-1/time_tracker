import { saveTokenToIndexedDB } from "../database/db.js";


document.getElementById("loginForm").addEventListener("submit", function (event) {
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailInput.value)) {
        emailError.classList.remove("hidden");
        event.preventDefault();
    } else {
        emailError.classList.add("hidden");
    }
});
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.querySelector("input[name='password']");
    const emailError = document.getElementById("emailError");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        emailError.classList.remove("hidden");
        return;
    } else {
        emailError.classList.add("hidden");
    }

    try {
        const response = await fetch("http://localhost:2025/api/v1/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });


        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }
        await saveTokenToIndexedDB(data.data.token);
        alert("Login Successful!");
        if (data.data.isAdmin) {
            window.location.href = "/admin/dashboard";
        } else {
            window.location.href = "/user/dashboard";
        }

    } catch (error) {
        alert(error.message);
    }
});




