document.addEventListener("DOMContentLoaded",async () => {

    const workHistoryModal = document.getElementById("work-history-modal");
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
