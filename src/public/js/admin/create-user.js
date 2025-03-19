import { getTokenFromIndexedDB } from "../database/db.js";
import { fetchUsers } from "./get-all-user.js";

async function createUser() {
    console.log("create-user.js loaded!");
    document.getElementById("create-user-btn").addEventListener("click", function () {
        document.getElementById("create-user-modal").classList.remove("hidden");
    });

    document.getElementById("close-modal-btn").addEventListener("click", function () {
        document.getElementById("create-user-modal").classList.add("hidden");
    });

    document.getElementById("create-user-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const newUser = {
            userName: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            designation: document.getElementById("designation").value,
            salary: document.getElementById("salary").value,
            isVerified: document.getElementById("isVerified").checked,
        };

        const token = await getTokenFromIndexedDB();
        if (!token) {
            console.error("No token found!");
            alert("Authentication error. Please log in again.");
            return;
        }

        try {
            const response = await fetch("http://localhost:2025/api/v1/user/register", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("User created successfully:", result);

            alert("User created successfully!");
            document.getElementById("create-user-modal").classList.add("hidden");
            await fetchUsers();

            // location.reload(); // Refresh user list
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user. Check console for details.");
        }
    });

}

createUser();