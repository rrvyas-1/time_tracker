import { getTokenFromIndexedDB } from "../database/db.js";

document.getElementById("deleted-users-btn").addEventListener("click", async () => {
    try {
        const token = await getTokenFromIndexedDB();
        if (!token) {
            console.error("No token found!");
            return;
        }

        const response = await fetch("http://localhost:2025/api/v1/user/deleted-user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch deleted users");
        }

        const data = await response.json();
        renderDeletedUsers(data.data);
        document.getElementById("deleted-users-modal").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching deleted users:", error);
        alert("Error fetching deleted users");
    }
});

function renderDeletedUsers(users) {
    console.log("🚀 Rendering Deleted Users:", users);

    const deletedUserList = document.getElementById("deleted-user-list");
    deletedUserList.innerHTML = "";

    if (!users || !Array.isArray(users) || users.length === 0) {
        console.error("⚠️ No deleted users found or users is not an array!");
        deletedUserList.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">No deleted users found</td></tr>`;
        return;
    }

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.className = "border-b border-gray-300";

        tr.innerHTML = `
            <td class="p-4">${user.userName || "N/A"}</td>
            <td class="p-4">${user.email || "N/A"}</td>
            <td class="p-4">${user.designation || "N/A"}</td>
            <td class="p-4">${user.salary || "0.00"}</td>
            <td class="p-4 text-center">${user.isVerified ? "✅" : "❌"}</td>
            <td class="p-4">${formatDate(user.updatedAt)}</td>
        `;

        deletedUserList.appendChild(tr);
    });
}

function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
}

// Close the modal
document.getElementById("close-deleted-users-modal").addEventListener("click", () => {
    document.getElementById("deleted-users-modal").classList.add("hidden");
});
