/**
 * This script handles form submissions and saving requests to IndexedDB
 * if the user is offline
 */

/**
 * Add event listeners to the window to detect when the user is offline
 */
window.addEventListener("offline", () => {
  showOfflineWarning();
});

/**
 * Add event listeners to the window to detect when the user is online
 */
window.addEventListener("online", () => {
  removeOfflineMessage();
});

/**
 * Show a warning message to the user when they are offline
 */
function showOfflineWarning() {
  const offlineWarning = document.getElementById("offline-warning");
  offlineWarning.innerHTML =
    "You are offline. Any requests/messages you send will be sent when you are online again.";
  offlineWarning.classList.add("alert", "alert-warning");
}

/**
 * Remove the offline warning message when the user is back online
 */
function removeOfflineMessage() {
  const offlineWarning = document.getElementById("offline-warning");
  offlineWarning.innerHTML = "";
  offlineWarning.classList.remove("alert", "alert-warning");
}

/**
 * Wrapper function around a form submit event
 * This allows us to save the request to IndexedDB if the user is offline
 * and then send the request when the user is back online
 * @param event: the form submit event
 */
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const body = getRequestBody(form);
  // If the user is online, send the request
  fetch(`${form.action}`, {
    method: form.method,
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => {
      // Redirect the user to the new page if response redirects
      if (res.ok && res.redirected) {
        window.location.href = res.url;
      }
    })
    .catch((err) => {
      // If the user is offline, save the request to IndexedDB
      saveRequestLocally({
        url: form.action,
        method: form.method,
        body: body,
      });
      registerBackgroundSync();
    });
}

/**
 * Helper function to get the form data body
 * @param form: the form element
 * @returns an object containing the form data
 */
function getRequestBody(form) {
  const formData = new FormData(form);
  const body = {};
  for (const pair of formData.entries()) {
    body[pair[0]] = pair[1];
  }
  return body;
}

/**
 * Save the request to IndexedDB
 * @param request: the request object to be saved and eventually sent
 */
function saveRequestLocally(request) {
  return new Promise((resolve, reject) => {
    // Connect to IndexedDB
    let db;
    const database = window.indexedDB.open("birdwatcher-db", 1);
    database.onsuccess = (event) => {
      db = event.target.result;
      const transaction = db.transaction("requests", "readwrite");
      const store = transaction.objectStore("requests");
      const data = {
        url: request.url,
        method: request.method,
        timestamp: new Date().getTime(),
        body: JSON.stringify(request.body),
      };
      const addRequest = store.add(data);
      addRequest.onsuccess = () => {
        console.log("Request stored in IndexedDB");
        resolve(new Response(null, { status: 200 }));
      };
      addRequest.onerror = (error) => {
        console.error("Error storing request in IndexedDB: ", error);
        reject(new Response(null, { status: 500 }));
      };
    };
    database.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
    };
  });
}

/**
 * Register a background sync event to send requests when the user is back online
 */
function registerBackgroundSync() {
  navigator.serviceWorker.ready
    .then((registration) => {
      registration.sync.register("sync-requests");
    })
    .catch(console.error);
}

/**
 * Listen for messages from the client
 * If the message is a redirect, redirect the user to the new page
 */
navigator.serviceWorker.addEventListener("message", (event) => {
  // Redirect the user to the new bird page if the request was successful
  if (event.data && event.data.type === "redirect") {
    window.location.href = event.data.url;
  }
});
