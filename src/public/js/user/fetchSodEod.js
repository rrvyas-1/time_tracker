import { getTokenFromIndexedDB } from "../database/db.js";

/**
 * Fetches SOD & EOD data from the API
 */
export async function fetchSodEod() {
    const token = await getTokenFromIndexedDB();
    if (!token) {
        console.error("No token found!");
        return;
    }

    try {
        const response = await fetch("http://localhost:2025/api/v1/sod-eod/get-all", {
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

        const { data } = await response.json();
        console.log("🚀 SOD & EOD Data:", data);

        renderSodEod(data);
    } catch (error) {
        console.error("Error fetching SOD & EOD data:", error);
        renderSodEod([]);
    }
}

/**
 * Renders the SOD & EOD data into the table
 */
function renderSodEod(data) {
    console.log("🚀 Rendering SOD & EOD:", data);

    const tableBody = document.getElementById("sod-eod-list");
    tableBody.innerHTML = "";

    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error("⚠️ No data found or data is not an array!");
        tableBody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">No records found</td></tr>`;
        return;
    }

    data.forEach(record => {
        const rowId = `row-${Math.random().toString(36).substr(2, 9)}`;

        const tr = document.createElement("tr");
        tr.className = "border-b border-[var(--secondary-color)] hover:bg-gray-700 transition duration-200 cursor-pointer";
        tr.onclick = () => toggleExpand(rowId);

        tr.innerHTML = `
            <td class="px-4 py-3 text-center">${formatDate(record.date)}</td>
            <td class="px-4 py-3 text-green-300 text-center">${formatTime(record.sod?.time) || "N/A"}</td>
            <td class="px-4 py-3 text-red-400 text-center">${formatTime(record.eod?.time) || "N/A"}</td>
        `;

        tableBody.appendChild(tr);

        const expandableRow = document.createElement("tr");
        expandableRow.id = rowId;
        expandableRow.className = "hidden";

        expandableRow.innerHTML = `
            <td colspan="3" class="p-4 bg-gray-800 text-gray-300">
                <strong>SOD Tasks:</strong>
                ${renderTaskList(record.sod?.tasks)}
                <br>
                <strong>EOD Tasks:</strong>
                ${renderTaskList(record.eod?.tasks)}
            </td>
        `;

        tableBody.appendChild(expandableRow);
    });
}

/**
 * Toggles the visibility of the expandable row
 */
window.toggleExpand = function (rowId) {
    const row = document.getElementById(rowId);
    if (row) {
        row.classList.toggle("hidden");
    }
};

/**
 * Helper function to format tasks
 */
function renderTaskList(tasks) {
    if (!tasks || tasks.length === 0) return `<span class="text-gray-500">No tasks</span>`;
    return `<ul class="list-disc ml-4">${tasks.map(task => `<li class="text-gray-300">${task.description} <span class="text-gray-400">(${task.status})</span></li>`).join("")}</ul>`;
}

/**
 * Helper function for date formatting
 */
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" });
}

function formatTime(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true // Convert to 12-hour format
    });
}

// Fetch data on DOM load
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 DOM fully loaded! Fetching SOD & EOD data...");
    setTimeout(await fetchSodEod(), 400);
});
