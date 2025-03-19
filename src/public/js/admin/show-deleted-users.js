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
        renderDeletedUsers(data.users);
        document.getElementById("deleted-users-modal").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching deleted users:", error);
        alert("Error fetching deleted users");
    }
});

// Function to render deleted users in the modal
function renderDeletedUsers(users) {
    console.log("🚀 Rendering Users:", users);

    const userList = document.getElementById("deleted-user-template");
    userList.innerHTML = "";

    if (!users || !Array.isArray(users) || users.length === 0) {
        console.error("⚠️ No users found or users is not an array!");
        userList.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-gray-500">No users found</td></tr>`;
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
            <td class="p-4">${formatDate(user.createdAt)}</td>
            <td class="p-4">${formatDate(user.loggedAt)}</td>
            <td class="p-4 text-center">
                <button class="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                <button class="delete-user-btn bg-red-500 text-white px-4 py-2 rounded" data-user-id=${user._id}>Delete</button>
            </td>
        `;

        userList.appendChild(tr);
    });
    // const templateSource = document.getElementById("deleted-user-template").innerHTML;
    // const template = Handlebars.compile(templateSource);
    // const html = template({ users });
    // document.getElementById("deleted-user-list").innerHTML = html;
}

// Close the modal
document.getElementById("close-deleted-users-modal").addEventListener("click", () => {
    document.getElementById("deleted-users-modal").classList.add("hidden");
});
