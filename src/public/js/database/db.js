const DB_NAME = "AuthDB";
const STORE_NAME = "tokens";
const TOKEN_KEY = "authToken"; // Key for storing the authentication token

// Open IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject("Error opening IndexedDB: " + event.target.errorCode);
    });
}

// Save Token to IndexedDB
export async function saveTokenToIndexedDB(token) {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        store.put({ id: TOKEN_KEY, token });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                db.close();
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

// Get Token from IndexedDB
export async function getTokenFromIndexedDB() {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.get(TOKEN_KEY);
            request.onsuccess = () => {
                db.close();
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

// Delete Token from IndexedDB (for Logout)
export async function deleteTokenFromIndexedDB() {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        store.delete(TOKEN_KEY);

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                db.close();
                resolve("Token deleted successfully");
            };
            transaction.onerror = () => {
                db.close();
                reject("Error deleting token");
            };
        });
    } catch (error) {
        console.error("deleteTokenFromIndexedDB Error:", error);
    }
}

// Save any key-value pair to IndexedDB
export async function saveToIndexedDB(key, value) {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        store.put({ id: key, value });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                db.close();
                resolve("Data saved successfully");
            };
            transaction.onerror = () => {
                db.close();
                reject("Error saving data");
            };
        });
    } catch (error) {
        console.error("saveToIndexedDB Error:", error);
    }
}

// Retrieve any key-value pair from IndexedDB
export async function getFromIndexedDB(key) {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);

        return new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => {
                db.close();
                resolve(request.result?.value || null);
            };
            request.onerror = () => {
                db.close();
                reject("Error retrieving data");
            };
        });
    } catch (error) {
        console.error("getFromIndexedDB Error:", error);
    }
}
