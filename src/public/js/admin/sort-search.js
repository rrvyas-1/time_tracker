document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const headers = document.querySelectorAll("th[data-column]");
    let sortDirection = {}; // Store sorting direction

    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const tableRows = document.querySelectorAll("#user-list tr"); // Select dynamically

        tableRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchTerm) ? "" : "none";
        });
    });

    headers.forEach(header => {
        header.addEventListener("click", () => {
            const column = header.getAttribute("data-column");
            const tbody = document.getElementById("user-list");
            const rowsArray = Array.from(tbody.querySelectorAll("tr")); // Select dynamically
            const isAscending = sortDirection[column] ?? true;

            const index = Array.from(header.parentElement.children).indexOf(header) + 1;

            rowsArray.sort((rowA, rowB) => {
                const cellA = rowA.querySelector(`td:nth-child(${index})`)?.textContent.trim() || "";
                const cellB = rowB.querySelector(`td:nth-child(${index})`)?.textContent.trim() || "";

                const isNumeric = !isNaN(cellA) && !isNaN(cellB);
                return isNumeric
                    ? (isAscending ? parseFloat(cellA) - parseFloat(cellB) : parseFloat(cellB) - parseFloat(cellA))
                    : (isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA));
            });

            sortDirection[column] = !isAscending;

            tbody.innerHTML = "";
            rowsArray.forEach(row => tbody.appendChild(row));
        });
    });

    const observer = new MutationObserver(() => {
        const newTableRows = document.querySelectorAll("#user-list tr");
        if (newTableRows.length > 0) {
            observer.disconnect(); // Stop observing once rows are detected
        }
    });

    observer.observe(document.getElementById("user-list"), { childList: true, subtree: true });
});
