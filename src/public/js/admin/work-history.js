document.addEventListener("DOMContentLoaded", async () => {
    const fromDate = document.getElementById("from-date");
    const endDate = document.getElementById("end-date");
    const goButton = document.getElementById("go-button");
    const closeModalButton = document.getElementById("close-work-history-modal");
    const workHistoryModal = document.getElementById("work-history-modal");

    function checkDates() {
        const fromValue = fromDate.value;
        const endValue = endDate.value;

        // Ensure "End-Date" is always greater than "From-Date"
        if (fromValue) {
            let minEndDate = new Date(fromValue);
            minEndDate.setDate(minEndDate.getDate() + 1);
            endDate.setAttribute("min", minEndDate.toISOString().split("T")[0]);
        } else {
            endDate.removeAttribute("min");
        }

        // Show "Go" button only if both dates are valid
        if (fromValue && endValue && endValue > fromValue) {
            goButton.classList.remove("hidden");
        } else {
            goButton.classList.add("hidden");
        }
    }

    // Clear selected dates when closing the modal
    function clearDates() {
        fromDate.value = "";
        endDate.value = "";
        endDate.removeAttribute("min");
        goButton.classList.add("hidden");
    }

    fromDate.addEventListener("change", checkDates);
    endDate.addEventListener("change", checkDates);

    closeModalButton.addEventListener("click", () => {
        workHistoryModal.classList.add("hidden"); // Hide modal
        clearDates(); // Clear dates
    });

    // const workHistoryModal = document.getElementById("work-history-modal");
    const closeWorkHistoryModal = document.getElementById("close-work-history-modal");

    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("work-history-btn")) {
            document.getElementById("work-history-modal").classList.remove("hidden");
        }
    });


    // Close modal when clicking the close button
    closeWorkHistoryModal.addEventListener("click", () => {
        workHistoryModal.classList.add("hidden");
    });

    // Optional: Close modal if clicking outside the modal content
    workHistoryModal.addEventListener("click", (event) => {
        if (event.target === workHistoryModal) {
            workHistoryModal.classList.add("hidden");
        }
    });
});
