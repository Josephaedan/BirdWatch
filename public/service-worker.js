/**
 * Service worker for offline support
 */

/**
 * Skip waiting for the service worker to activate
 */
self.skipWaiting();

/**
 * Listen for sync events and dispatch locally stored requests in indexedDB
 */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncRequests());
  }
});

/**
 * Initialise IndexedDB
 */
let db;

const request = indexedDB.open("birdwatcher-db", 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  const actionsStore = db.createObjectStore("requests", {
    autoIncrement: true,
  });
  actionsStore.createIndex("url", "url", { unique: false });
  actionsStore.createIndex("method", "method", { unique: false });
  actionsStore.createIndex("timestamp", "timestamp", { unique: false });
  actionsStore.createIndex("body", "body", { unique: true });
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("IndexedDB initialised");
};

request.onerror = (event) => {
  console.error("IndexedDB error:", event.target.error);
};

/**
 * Retrieve all locally stored requests from indexedDB and dispatch them
 */
function syncRequests() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("requests", "readwrite");
    const store = transaction.objectStore("requests");

    const getAll = store.getAll();
    getAll.onsuccess = () => {
      const requests = getAll.result;
      const syncPromises = requests.map((request, index) => {
        return fetch(request.url, {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: request.body,
        })
          .then((res) => {
            // Redirect the user to the new page if response redirects
            // This is done via a postMessage to the client (registered in public/scripts/form-submit.js)
            if (res.ok && res.redirected) {
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({ type: "redirect", url: res.url });
                });
              });
            }
          })
          .catch((error) => {
            console.error("Error syncing request:", error);
          });
      });

      Promise.all(syncPromises)
        .then(() => {
          console.log("Sync completed");
        })
        .then(() => {
          deleteAllRequests();
        })
        .catch((error) => {
          console.error("Sync failed:", error);
          return reject(error);
        });
    };

    getAll.onerror = () => {
      console.error("Error retrieving requests from IndexedDB");
      reject();
    };
  });
}

/**
 * Delete all locally stored requests in indexedDB
 * @returns
 */
function deleteAllRequests() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("requests", "readwrite");
    const store = transaction.objectStore("requests");
    const deleteRequest = store.clear();

    deleteRequest.onsuccess = () => {
      return resolve();
    };

    deleteRequest.onerror = (error) => {
      return reject(error.message);
    };
  });
}
