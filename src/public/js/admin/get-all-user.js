import { getTokenFromIndexedDB } from "../database/db.js";


export async function fetchUsers() {
  const token = await getTokenFromIndexedDB();
  if (!token) {
    console.error("No token found!");
    return;
  }

  try {
    const response = await fetch("http://localhost:2025/api/v1/user/get-all", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("🚀 Users Data:", data.data); // Check the response
    renderUsers(data.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    renderUsers([])
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 DOM fully loaded!");

  setTimeout(async () => {
    const templateElement = document.getElementById("user-template");
    if (!templateElement) {
      console.error(
        "⚠️ Template not found! Make sure it's inside get-all-users.hbs."
      );
      return;
    }
    await fetchUsers();
  }, 400);
});


function renderUsers(users) {
  console.log("🚀 Rendering Users:", users);

  const userList = document.getElementById("user-list");
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
}

// Helper function for date formatting
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
}





