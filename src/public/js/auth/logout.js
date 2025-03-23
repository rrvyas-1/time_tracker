import { deleteTokenFromIndexedDB } from "../database/db.js";

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector("a[href='/logout']");

    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Prevent default link behavior

            try {
                await deleteTokenFromIndexedDB(); // Delete token from IndexedDB
                sessionStorage.clear(); // Clear session storage
                // localStorage.clear(); // Clear local storage

                window.location.replace("http://localhost:2025/login");

                history.pushState(null, "", "http://localhost:2025/login");
                window.onpopstate = () => history.pushState(null, "", "http://localhost:2025/login");
            } catch (error) {
                console.error("Logout Error:", error);
            }
        });
    }
});
