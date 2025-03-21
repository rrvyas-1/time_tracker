// document.addEventListener("DOMContentLoaded", function () {
//   const startDayBtn = document.getElementById("start-day-btn");
//   const taskModal = document.getElementById("task-modal");
//   const closeModalBtn = document.getElementById("close-modal-btn");
//   const addTaskBtn = document.getElementById("add-task-btn");
//   const saveTasksBtn = document.getElementById("save-tasks-btn");
//   const taskList = document.getElementById("task-list");

import { getTokenFromIndexedDB } from "../database/db.js";

//   if (!startDayBtn || !taskModal) {
//     console.error("Start Day button or Task Modal not found!");
//     return;
//   }

//   const statusOptions = ["todo", "inprogress", "done"];
//   let taskCount = 0;

//   // ✅ Open Modal
//   startDayBtn.addEventListener("click", () => {
//     taskModal.classList.remove("hidden", "opacity-0");
//     taskModal.classList.add(
//       "flex",
//       "opacity-100",
//       "transition-opacity",
//       "duration-300"
//     );
//   });

//   // ✅ Close Modal
//   closeModalBtn.addEventListener("click", () => {
//     taskModal.classList.add("opacity-0");
//     taskList.innerHTML = "";
//     taskCount = 0;
//     setTimeout(() => {
//       taskModal.classList.add("hidden");
//     }, 300);
//   });

//   // ✅ Add New Task Input with Interactive Design
//   addTaskBtn.addEventListener("click", (event) => {
//     event.preventDefault();

//     taskCount++;

//     const taskWrapper = document.createElement("div");
//     taskWrapper.className =
//       "task-item flex items-center gap-2 p-3 border rounded-lg bg-gray-100 shadow-sm transition-transform duration-300 scale-95 hover:scale-100";

//     // Task Input
//     const newTask = document.createElement("textarea");
//     newTask.className =
//       "task-input w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400";
//     newTask.placeholder = `Task ${taskCount}...`;

//     // Status Dropdown
//     const statusDropdown = document.createElement("select");
//     statusDropdown.className =
//       "task-status p-2 border rounded-lg bg-white shadow-sm";
//     statusOptions.forEach((status) => {
//       const option = document.createElement("option");
//       option.value = status;
//       option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
//       statusDropdown.appendChild(option);
//     });

//     // Remove Task Button
//     const removeLink = document.createElement("button");
//     removeLink.textContent = "❌";
//     removeLink.className =
//       "remove-task text-red-500 text-lg hover:text-red-700 transition";
//     removeLink.addEventListener("click", () => {
//       taskWrapper.classList.add("scale-90", "opacity-0");
//       setTimeout(() => taskWrapper.remove(), 200);
//       taskCount--;
//     });

//     taskWrapper.appendChild(newTask);
//     taskWrapper.appendChild(statusDropdown);
//     taskWrapper.appendChild(removeLink);
//     taskList.appendChild(taskWrapper);
//   });

//   // ✅ Save Tasks
//   saveTasksBtn.addEventListener("click", () => {
//     const taskItems = document.querySelectorAll(".task-item");
//     const tasksArray = [];

//     taskItems.forEach((taskItem) => {
//       const taskInput = taskItem.querySelector(".task-input");
//       const statusDropdown = taskItem.querySelector(".task-status");

//       if (taskInput.value.trim() !== "") {
//         tasksArray.push({
//           description: taskInput.value.trim(),
//           status: statusDropdown.value,
//         });
//       }
//     });

//     console.log("Saved Tasks:", tasksArray);
//     taskList.innerHTML = "";
//     taskCount = 0;
//     taskModal.classList.add("opacity-0");
//     setTimeout(() => {
//       taskModal.classList.add("hidden");
//     }, 300);
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const startDayBtn = document.getElementById("start-day-btn");
  const endDayBtn = document.getElementById("end-day-btn"); // New button for EOD
  const taskModal = document.getElementById("task-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const addTaskBtn = document.getElementById("add-task-btn");
  const saveTasksBtn = document.getElementById("save-tasks-btn");
  const taskList = document.getElementById("task-list");

  if (!startDayBtn || !taskModal) {
    console.error("Start Day button or Task Modal not found!");
    return;
  }

  const statusOptions = ["todo", "inprogress", "done"];
  let taskCount = 0;
  let currentType = "sod"; // Default type

  // ✅ Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split("T")[0];

  // ✅ Check if SOD or EOD was submitted today
  const lastSubmittedDate = localStorage.getItem("lastSubmittedDate");

  // If today's date is different from the last submitted date, enable the buttons
  if (lastSubmittedDate !== today) {
    localStorage.removeItem("sodSubmitted");
    localStorage.removeItem("eodSubmitted");
    startDayBtn.disabled = false;
    endDayBtn.disabled = false;
    startDayBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
    endDayBtn.classList.remove("bg-gray-400", "cursor-not-allowed");
  }

  // ✅ Load Button States from Local Storage
  if (localStorage.getItem("sodSubmitted") === "true") {
    startDayBtn.disabled = true;
    startDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  }
  if (localStorage.getItem("eodSubmitted") === "true") {
    endDayBtn.disabled = true;
    endDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  }

  // ✅ Open Modal (SOD or EOD)
  function openModal(type) {
    currentType = type; // Set the type (SOD or EOD)
    taskModal.classList.remove("hidden", "opacity-0");
    taskModal.classList.add(
      "flex",
      "opacity-100",
      "transition-opacity",
      "duration-300"
    );
  }

  // ✅ Attach Event Listeners to Buttons
  startDayBtn.addEventListener("click", () => openModal("sod"));
  endDayBtn.addEventListener("click", () => openModal("eod"));

  // ✅ Close Modal
  closeModalBtn.addEventListener("click", () => {
    taskModal.classList.add("opacity-0");
    taskList.innerHTML = "";
    taskCount = 0;
    setTimeout(() => {
      taskModal.classList.add("hidden");
    }, 300);
  });

  // ✅ Add New Task
  addTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();
    taskCount++;

    const taskWrapper = document.createElement("div");
    taskWrapper.className =
      "task-item flex items-center gap-2 p-3 border rounded-lg bg-gray-100 shadow-sm transition-transform duration-300 scale-95 hover:scale-100";

    // Task Input
    const newTask = document.createElement("textarea");
    newTask.className =
      "task-input w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400";
    newTask.placeholder = `Task ${taskCount}...`;

    // Status Dropdown
    const statusDropdown = document.createElement("select");
    statusDropdown.className =
      "task-status p-2 border rounded-lg bg-white shadow-sm";
    statusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      statusDropdown.appendChild(option);
    });

    // Remove Task Button
    const removeLink = document.createElement("button");
    removeLink.textContent = "❌";
    removeLink.className =
      "remove-task text-red-500 text-lg hover:text-red-700 transition";
    removeLink.addEventListener("click", () => {
      taskWrapper.classList.add("scale-90", "opacity-0");
      setTimeout(() => taskWrapper.remove(), 200);
      taskCount--;
    });

    taskWrapper.appendChild(newTask);
    taskWrapper.appendChild(statusDropdown);
    taskWrapper.appendChild(removeLink);
    taskList.appendChild(taskWrapper);
  });

  // ✅ Save Tasks and Send API Request
  saveTasksBtn.addEventListener("click", async () => {
    const taskItems = document.querySelectorAll(".task-item");
    const tasksArray = [];

    taskItems.forEach((taskItem) => {
      const taskInput = taskItem.querySelector(".task-input");
      const statusDropdown = taskItem.querySelector(".task-status");

      if (taskInput.value.trim() !== "") {
        tasksArray.push({
          description: taskInput.value.trim(),
          status: statusDropdown.value,
        });
      }
    });

    if (tasksArray.length === 0) {
      alert("Please add at least one task before saving.");
      return;
    }

    // ✅ Prepare API Payload
    const requestData = {
      type: currentType, // "sod" or "eod"
      tasks: tasksArray,
    };

    console.log("Sending Data:", requestData);

    try {
      const token = await getTokenFromIndexedDB();
      if (!token) {
        console.error("No token found!");
        return;
      }
      const response = await fetch(
        "http://localhost:2025/api/v1/sod-eod/create-sod-eod",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
          credentials: "include",
        }
      );

      if (response.ok) {
        alert(`${currentType.toUpperCase()} submitted successfully!`);

        // ✅ Disable Button After Submission
        if (currentType === "sod") {
          startDayBtn.disabled = true;
          startDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
          localStorage.setItem("sodSubmitted", "true");
        } else {
          endDayBtn.disabled = true;
          endDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
          localStorage.setItem("eodSubmitted", "true");
        }

        // ✅ Store Today's Date as Last Submitted Date
        localStorage.setItem("lastSubmittedDate", today);

        // ✅ Reset Modal
        taskList.innerHTML = "";
        taskCount = 0;
        taskModal.classList.add("opacity-0");
        setTimeout(() => {
          taskModal.classList.add("hidden");
        }, 300);
      } else {
        alert(`Failed to submit ${currentType.toUpperCase()}. Try again.`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again later.");
    }
  });
});
