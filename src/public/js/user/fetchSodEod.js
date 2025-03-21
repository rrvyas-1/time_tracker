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
    const response = await fetch(
      "http://localhost:2025/api/v1/sod-eod/get-all",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

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
    tableBody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-500">No records found</td></tr>`;
    return;
  }

  data.forEach((record) => {
    const rowId = `row-${Math.random().toString(36).substr(2, 9)}`;

    const tr = document.createElement("tr");
    tr.className =
      "border-b border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer";
    tr.onclick = () => toggleExpand(rowId);

    tr.innerHTML = `
      <td class="px-4 py-3 text-center">${formatDate(record.date)}</td>
      <td class="px-4 py-3 text-center text-green-700 font-semibold">${
        formatTime(record.sod?.time) || "N/A"
      }</td>
      <td class="px-4 py-3 text-center text-red-700 font-semibold">${
        formatTime(record.eod?.time) || "N/A"
      }</td>
    `;

    tableBody.appendChild(tr);

    // Expandable Row (Side-by-Side SOD & EOD)
    const expandableRow = document.createElement("tr");
    expandableRow.id = rowId;
    expandableRow.className = "hidden bg-gray-50";

    expandableRow.innerHTML = `
      <td colspan="3" class="p-4">
        <div class="grid grid-cols-2 gap-6">
          <!-- SOD Section -->
          <div class="bg-green-100 p-4 rounded-lg shadow relative">
            <h3 class="text-lg font-bold text-green-900 sticky top-0 bg-green-100 p-2 z-10">🌅 Start of Day Tasks</h3>
            <div class="max-h-48 overflow-y-scroll p-2 no-scrollbar">
              ${renderTaskList(record.sod?.tasks)}
            </div>
          </div>

          <!-- EOD Section -->
          <div class="bg-red-100 p-4 rounded-lg shadow relative">
            <h3 class="text-lg font-bold text-red-900 sticky top-0 bg-red-100 p-2 z-10">🌙 End of Day Tasks</h3>
            <div class="max-h-48 overflow-y-scroll p-2 no-scrollbar">
              ${renderTaskList(record.eod?.tasks)}
            </div>
          </div>
        </div>
      </td>
    `;

    tableBody.appendChild(expandableRow);
  });

  // Apply CSS to hide scrollbars
  applyNoScrollbar();
}

/**
 * Apply CSS to hide scrollbars
 */
function applyNoScrollbar() {
  const style = document.createElement("style");
  style.innerHTML = `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(style);
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
  if (!tasks || tasks.length === 0)
    return `<span class="text-gray-500">No tasks available</span>`;
  return `<ul class="list-disc ml-4 mt-2">${tasks
    .map(
      (task) =>
        `<li class="text-gray-700 break-words">${task.description} <span class="text-gray-500">(${task.status})</span></li>`
    )
    .join("")}</ul>`;
}

/**
 * Helper function for date formatting
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Helper function for time formatting
 */
function formatTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Convert to 12-hour format
  });
}

// Fetch data on DOM load
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 DOM fully loaded! Fetching SOD & EOD data...");
  setTimeout(await fetchSodEod(), 400);
});
