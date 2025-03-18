import { getTokenFromIndexedDB } from "../database/db.js";

async function fetchUsers() {
  const token = await getTokenFromIndexedDB();
  if (!token) {
    console.error("No token found!");
    return;
  }

  try {
    const response = await fetch("http://localhost:2025/api/v1/user/get-all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
  }
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM fully loaded!");

  setTimeout(() => {
    const templateElement = document.getElementById("user-template");
    if (!templateElement) {
      console.error(
        "⚠️ Template not found! Make sure it's inside get-all-users.hbs."
      );
      return;
    }

    // if (!templateElement.innerHTML.trim()) {
    //   console.error(
    //     "⚠️ Template is empty! Ensure it contains Handlebars markup."
    //   );
    //   return;
    // }

    fetchUsers(); // Call your API fetch function only if template exists
  }, 500); // Small delay to ensure everything is loaded
});

function renderUsers(users) {
  console.log("🚀 Rendering Users:", users);

  if (!users || !Array.isArray(users) || users.length === 0) {
    console.error("⚠️ No users found or users is not an array!");
    return;
  }

  const templateElement = document.getElementById("user-template");
  console.log("🔎 Template Element:", templateElement);

  if (!templateElement) {
    console.error("⚠️ Template not found in the DOM!");
    return;
  }

  const templateSource = templateElement.innerHTML.trim();
  console.log("📜 Template Source:", templateSource);

  const template = Handlebars.compile(templateSource);

  Handlebars.registerHelper("formatDate", function (dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  });

  const htmlOutput = template({ users });

  document.getElementById("user-list").innerHTML = htmlOutput;

  console.log("🛠️ Rendered HTML:", htmlOutput);
  console.log("🔎 Checking Handlebars:", Handlebars);
  if (!window.Handlebars) {
    console.error("❌ Handlebars is not loaded!");
  }
}
