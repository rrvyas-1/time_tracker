
import { getTokenFromIndexedDB } from "../database/db.js";

const modal = document.getElementById("task-modal");
const modalHeader = document.getElementById("modal-header").querySelector("h2");

function openModal(type) {
  modalHeader.textContent =
    type === "start" ? "📝 Start of Day Tasks" : "📝 End of Day Tasks";
  modal.classList.remove("hidden");
}

document.getElementById("start-day-btn").addEventListener("click", () => openModal("start"));
document.getElementById("end-day-btn").addEventListener("click", () => openModal("end"));


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
  let currentType = "sod";

  const today = new Date().toISOString().split("T")[0];

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

  if (localStorage.getItem("sodSubmitted") === "true") {
    startDayBtn.disabled = true;
    startDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  }
  if (localStorage.getItem("eodSubmitted") === "true") {
    endDayBtn.disabled = true;
    endDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
  }
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

  startDayBtn.addEventListener("click", () => openModal("sod"));
  endDayBtn.addEventListener("click", () => openModal("eod"));

  closeModalBtn.addEventListener("click", () => {
    taskModal.classList.add("opacity-0");
    taskList.innerHTML = "";
    taskCount = 0;
    setTimeout(() => {
      taskModal.classList.add("hidden");
    }, 300);
  });

  addTaskBtn.addEventListener("click", (event) => {
    event.preventDefault();
    taskCount++;

    const taskWrapper = document.createElement("div");
    taskWrapper.className =
      "task-item flex items-center gap-2 p-3 border rounded-lg bg-gray-100 shadow-sm transition-transform duration-300 scale-95 hover:scale-100";

    const newTask = document.createElement("textarea");
    newTask.className =
      "task-input w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400";
    newTask.placeholder = `Task ${taskCount}...`;

    const statusDropdown = document.createElement("select");
    statusDropdown.className =
      "task-status p-2 border rounded-lg bg-white shadow-sm";
    statusOptions.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      statusDropdown.appendChild(option);
    });

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

    const requestData = {
      type: currentType,
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

        if (currentType === "sod") {
          startDayBtn.disabled = true;
          startDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
          localStorage.setItem("sodSubmitted", "true");
        } else {
          endDayBtn.disabled = true;
          endDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
          localStorage.setItem("eodSubmitted", "true");
        }

        localStorage.setItem("lastSubmittedDate", today);

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

// import { getTokenFromIndexedDB, getFromIndexedDB, saveToIndexedDB } from "../database/db.js";

// document.addEventListener("DOMContentLoaded", async function () {
//   const startDayBtn = document.getElementById("start-day-btn");
//   const endDayBtn = document.getElementById("end-day-btn");
//   const taskModal = document.getElementById("task-modal");
//   const closeModalBtn = document.getElementById("close-modal-btn");
//   const addTaskBtn = document.getElementById("add-task-btn");
//   const saveTasksBtn = document.getElementById("save-tasks-btn");
//   const taskList = document.getElementById("task-list");
//   const statusOptions = ["todo", "inprogress", "done"];
//   let taskCount = 0;
//   let currentType = "sod";
//   const today = new Date().toISOString().split("T")[0];

//   async function checkSubmissionStatus() {
//     const lastSubmittedDate = await getFromIndexedDB("lastSubmittedDate");
//     if (lastSubmittedDate !== today) {
//       await saveToIndexedDB("sodSubmitted", "false");
//       await saveToIndexedDB("eodSubmitted", "false");
//     }

//     const sodSubmitted = await getFromIndexedDB("sodSubmitted");
//     const eodSubmitted = await getFromIndexedDB("eodSubmitted");

//     startDayBtn.disabled = sodSubmitted === "true";
//     endDayBtn.disabled = eodSubmitted === "true";
//     if (sodSubmitted === "true") startDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
//     if (eodSubmitted === "true") endDayBtn.classList.add("bg-gray-400", "cursor-not-allowed");
//   }

//   await checkSubmissionStatus();

//   function openModal(type) {
//     currentType = type;
//     taskModal.classList.remove("hidden", "opacity-0");
//     taskModal.classList.add("flex", "opacity-100", "transition-opacity", "duration-300");
//   }

//   startDayBtn.addEventListener("click", () => openModal("sod"));
//   endDayBtn.addEventListener("click", () => openModal("eod"));

//   closeModalBtn.addEventListener("click", () => {
//     taskModal.classList.add("opacity-0");
//     taskList.innerHTML = "";
//     taskCount = 0;
//     setTimeout(() => taskModal.classList.add("hidden"), 300);
//   });

//   addTaskBtn.addEventListener("click", (event) => {
//     event.preventDefault();
//     taskCount++;
//     const taskWrapper = document.createElement("div");
//     taskWrapper.className = "task-item flex items-center gap-2 p-3 border rounded-lg bg-gray-100 shadow-sm";

//     const newTask = document.createElement("textarea");
//     newTask.className = "task-input w-full p-2 border rounded-lg";
//     newTask.placeholder = `Task ${taskCount}...`;

//     const statusDropdown = document.createElement("select");
//     statusDropdown.className = "task-status p-2 border rounded-lg bg-white";
//     statusOptions.forEach((status) => {
//       const option = document.createElement("option");
//       option.value = status;
//       option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
//       statusDropdown.appendChild(option);
//     });

//     const removeLink = document.createElement("button");
//     removeLink.textContent = "❌";
//     removeLink.className = "remove-task text-red-500 text-lg";
//     removeLink.addEventListener("click", () => {
//       taskWrapper.remove();
//       taskCount--;
//     });

//     taskWrapper.append(newTask, statusDropdown, removeLink);
//     taskList.appendChild(taskWrapper);
//   });

//   saveTasksBtn.addEventListener("click", async () => {
//     const tasksArray = [...document.querySelectorAll(".task-item")].map(taskItem => ({
//       description: taskItem.querySelector(".task-input").value.trim(),
//       status: taskItem.querySelector(".task-status").value,
//     })).filter(task => task.description !== "");

//     if (tasksArray.length === 0) {
//       alert("Please add at least one task before saving.");
//       return;
//     }

//     const requestData = { type: currentType, tasks: tasksArray };
//     console.log("Sending Data:", requestData);

//     try {
//       const token = await getTokenFromIndexedDB();
//       if (!token) {
//         console.error("No token found!");
//         return;
//       }
//       const response = await fetch("http://localhost:2025/api/v1/sod-eod/create-sod-eod", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify(requestData),
//         credentials: "include",
//       });

//       if (response.ok) {
//         alert(`${currentType.toUpperCase()} submitted successfully!`);
//         await saveToIndexedDB(currentType === "sod" ? "sodSubmitted" : "eodSubmitted", "true");
//         await saveToIndexedDB("lastSubmittedDate", today);
//         checkSubmissionStatus();
//         taskList.innerHTML = "";
//         taskModal.classList.add("opacity-0");
//         setTimeout(() => taskModal.classList.add("hidden"), 300);
//       } else {
//         alert(`Failed to submit ${currentType.toUpperCase()}. Try again.`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Network error. Please try again later.");
//     }
//   });
// });
