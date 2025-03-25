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
        Authorization: `Bearer ${token}`,
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
    tableBody.innerHTML = `<tr><td colspan="3" class="p-4 text-center text-gray-500">No records found</td></tr>`;
    return;
  }

  data.forEach((record) => {
    const rowId = `row-${Math.random().toString(36).substr(2, 9)}`;
    const tr = document.createElement("tr");
    tr.className = "border-b border-gray-300 hover:bg-gray-100 transition duration-200 cursor-pointer";
    tr.onclick = () => toggleExpand(rowId);
    tr.innerHTML = `
      <td class="px-4 py-3 text-center">${formatDate(record.date)}</td>
      <td class="px-4 py-3 text-center text-green-700 font-semibold">${formatTime(record.sod?.time) || "N/A"}</td>
      <td class="px-4 py-3 text-center text-red-700 font-semibold">${formatTime(record.eod?.time) || "N/A"}</td>
    `;
    tableBody.appendChild(tr);

    const expandableRow = document.createElement("tr");
    expandableRow.id = rowId;
    expandableRow.className = "hidden bg-gray-50";
    expandableRow.innerHTML = `
      <td colspan="3" class="p-4">
        <div class="grid grid-cols-2 gap-6">
          ${renderTaskSection("🌅 Start of Day Tasks", "green", record.sod?.tasks)}
          ${renderTaskSection("🌙 End of Day Tasks", "red", record.eod?.tasks)}
        </div>
      </td>
    `;
    tableBody.appendChild(expandableRow);
  });
  applyNoScrollbar();
}

/**
 * Generates a task section for SOD or EOD
 */
function renderTaskSection(title, color, tasks) {
  return `
    <div class="bg-${color}-100 p-4 rounded-lg shadow relative">
      <div class="flex justify-between items-center bg-${color}-100 p-2 z-10">
        <h3 class="text-lg font-bold text-${color}-900">${title}</h3>
        <div class="flex space-x-2">
          <span class="text-red-600">🔴 Todo</span>
          <span class="text-blue-600">🔵 In Progress</span>
          <span class="text-green-600">🟢 Completed</span>
        </div>
      </div>
      <div class="max-h-48 overflow-y-scroll p-2 no-scrollbar">
        ${renderTaskList(tasks)}
      </div>
    </div>`;
}

/**
 * Toggles the visibility of the expandable row
 */
window.toggleExpand = function (rowId) {
  document.querySelectorAll("[id^='row-']").forEach((row) => {
    if (row.id !== rowId) {
      row.classList.add("hidden");
    }
  });
  document.getElementById(rowId)?.classList.toggle("hidden");
};

/**
 * Renders the task list with status colors
 */
function renderTaskList(tasks) {
  if (!tasks || tasks.length === 0) {
    return `<span class="text-gray-500">No tasks available</span>`;
  }
  return `<ul class="list-disc ml-4 mt-2">
    ${tasks.map(task => {
    const statusColors = {
      todo: "text-red-600",
      inprogress: "text-green-600",
      done: "text-blue-600",
    };
    return `<li class="${statusColors[task.status.toLowerCase()] || 'text-gray-500'} break-words font-semibold">
        ${task.description}
      </li>`;
  }).join("")}
  </ul>`;
}

/**
 * Formats date to a readable format
 */
function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/**
 * Formats time to a 12-hour format
 */
function formatTime(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Applies CSS to hide scrollbars
 */
function applyNoScrollbar() {
  const style = document.createElement("style");
  style.innerHTML = `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(style);
}

// Fetch data on DOM load
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 DOM fully loaded! Fetching SOD & EOD data...");
  setTimeout(await fetchSodEod(), 400);
});
