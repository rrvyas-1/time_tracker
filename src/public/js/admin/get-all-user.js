import { getTokenFromIndexedDB } from "../database/db.js";

async function fetchUsers() {
    const token = await getTokenFromIndexedDB();
    if (!token) {
        console.error("No token found!");
        return;
    }

    try {
        const response = await fetch("http://localhost:2025/api/v1/user/get-all",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        renderUsers(data.data);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function renderUsers(users) {
    if (typeof Handlebars === "undefined") {
        console.error("Handlebars is not loaded!");
        return;
    }
    else {
        console.log("Handlebars is loaded"); 
    }

    const templateElement = document.getElementById("user-template");
    if (!templateElement) {
        console.error("Template not found in the DOM!");
        return;
    }

    const templateSource = templateElement.innerHTML;
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

    document.getElementById("user-list").innerHTML = template({ users });
    console.log(document.getElementById("user-list").innerHTML);
    
}

// Load data after the page is fully loaded
document.addEventListener("DOMContentLoaded", fetchUsers);

