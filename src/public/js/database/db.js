function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("AuthDB", 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("tokens")) {
                db.createObjectStore("tokens", { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject("Error opening IndexedDB: " + event.target.errorCode);
    });
}

export async function saveTokenToIndexedDB(token) {
    try {
        const db = await openDB();
        const transaction = db.transaction("tokens", "readwrite");
        const store = transaction.objectStore("tokens");

        store.put({ id: "authToken", token });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                db.close(); // Close DB after operation
                resolve("Token saved successfully");
            };
            transaction.onerror = () => {
                db.close();
                reject("Error saving token");
            };
        });
    } catch (error) {
        console.error("saveTokenToIndexedDB Error:", error);
    }
}

export async function getTokenFromIndexedDB() {
    try {
        const db = await openDB();
        const transaction = db.transaction("tokens", "readonly");
        const store = transaction.objectStore("tokens");

        return new Promise((resolve, reject) => {
            const request = store.get("authToken");
            request.onsuccess = () => {
                db.close(); // Close DB after operation
                resolve(request.result?.token || null);
            };
            request.onerror = () => {
                db.close();
                reject("Error retrieving token");
            };
        });
    } catch (error) {
        console.error("getTokenFromIndexedDB Error:", error);
    }
}
