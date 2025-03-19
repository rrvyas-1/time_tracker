import { getTokenFromIndexedDB } from "../database/db.js";
import { fetchUsers } from "./get-all-user.js";

async function deleteUser(userId) {
    console.log(`delete-user.js loaded! ${userId}`);
    try {
            const token = await getTokenFromIndexedDB();
            if (!token) {
                console.error("No token found!");
                return;
        }

        const response = await fetch("http://localhost:2025/api/v1/user/remove", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        alert("User deleted successfully");
        await fetchUsers()
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
    }
}

document.addEventListener("click",async function (event) {
    if (event.target.classList.contains("delete-user-btn")) {
        const userId = event.target.dataset.userId;
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(userId);
        }
    }
});