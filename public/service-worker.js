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
        // Create a FormData object from the request body
        // This is necessary to send the request again with fetch for uploading files
        const body = createFormData(JSON.parse(request.body));
        return fetch(request.url, {
          method: request.method,
          body: body,
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

            // If the response is ok but not redirected, refresh the page to update the UI
            if (res.ok && !res.redirected) {
              self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  client.postMessage({ type: "reload" });
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
          console.log(
            "Sync completed - All offline requests have been dispatched"
          );
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
 * Initialises a formData object from the stored request body in indexedDB
 * This allows for file uploads to work
 */
function createFormData(body) {
  const formData = new FormData();
  for (const key in body) {
    formData.append(key, body[key]);
  }

  // Convert the image property to a File object
  if (body.image) {
    const image = body.image;
    const file = convertDataURLtoFile(image);
    formData.set("image", file);
  }
  return formData;
}

/**
 * Converts a dataURL to a File object for uploading to server
 * Code taken from Source: https://stackoverflow.com/questions/21227078
 */
function convertDataURLtoFile(dataurl) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    fileType = mime.split("/")[1],
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${new Date().getTime()}.${fileType}`, {
    type: mime,
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
