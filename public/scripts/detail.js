let name = null;
let roomNo = null;
let socket = io();

/**
* Initialises the page and adds event listeners
*/
window.addEventListener("DOMContentLoaded", () => {
    var idSearchFormBtn = document.getElementById("id-search-submit");
    var idSubmitForm = document.getElementById("id-form");

    if (idSearchFormBtn) {
        idSearchFormBtn.addEventListener("click", idSearch);
    }

    if (idSubmitForm) {
        idSubmitForm.addEventListener("submit", sendIdentification);
    }
});

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // Connect to the room as shown in the URL
    const sightingID = window.location.pathname.replace("/sightings/", "");
    socket.emit("create or join", sightingID); // Connects to room

    // called when a message is received
    socket.on("chat", function (room, userId, chatText) {
    writeOnHistory("<b>" + userId + " :</b> " + chatText);
    });

    // Called when a message is to be sent
    const chatForm = document.getElementById("chatform");
    chatForm.addEventListener("submit", sendChatText);
}

/**
 * Called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket. It also submits the form to the server to save the message
 * to the database. In the event that the user is offline, the message will be saved to IndexedDB
 * and sent when the user is back online.
 */
function sendChatText(event) {
    event.preventDefault();

    const sightingID = window.location.pathname.replace("/sightings/", "");
    let userNickname = document.getElementById("userNickname").value;
    let chatText = document.getElementById("text").value;

    socket.emit("chat", sightingID, userNickname, chatText);

    // Submit post request to server
    // HandleSubmit is defined in public/scripts/form-submit.js
    // and will save the request to IndexedDB if the user is offline
    handleSubmit(event);

    // Clear input fields for username and text
    document.getElementById("text").value = "";

    return false;
}

/**
 * it appends the given html text to the history div
 * @param text: the text to append
 */
function writeOnHistory(text) {
    let chatHistory = document.getElementById('chatHistory');
    let listItem = document.createElement('li');
    listItem.className = "list-group-item"
    listItem.innerHTML = new Date().toLocaleString("en-GB") + "<br>" + text;
    chatHistory.appendChild(listItem);
    document.getElementById('text').value = '';
}

/**
 * Handles the Edit Identification event.
 */
function editId(nickname){
    const isUser = confirm(`You have to be the creator of this sighting in order to edit the identification details.
Are you ${nickname}?`);
    if (isUser) {

        document.getElementById("popup").style.display = "block";
    }
}

/**
 * Closes the Identification Pop Up.
 */
function closePopup() {
    document.getElementById("popup").style.display = "none";
}


/**
 * Called when the user submits the identification form
 * It sends the identification to the server and saves it to the database.
 * In the event that the user is offline, the identification will be saved to IndexedDB
 * and sent when the user is back online.
 */
function sendIdentification(event) {
    console.log("Sending identification...");

    if (document.getElementById("idCommonName").value === "unknown") {
        alert("You must select a new identification to submit!");
        return ;
    }

    event.preventDefault();

    // Submit post request to server
    // HandleSubmit is defined in public/scripts/form-submit.js
    // and will save the request to IndexedDB if the user is offline
    console.log("Event: ", event)
    handleSubmit(event);

    // Close popup
    closePopup();

    // Reload page
    // window.location.reload()

    return false;
}

/**
 * Called when the page loads to display the location of the sighting on the map.
 * The latitude and longitude are passed as parameters and are not editable by the user.
 * @param latitude: the latitude of the sighting
 * @param longitude: the longitude of the sighting
 */
function displayLocationOnMap(latitude, longitude) {
  const map = document.getElementById("map");
  leaflet = L.map(map).setView([latitude, longitude], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(leaflet);
  L.marker([latitude, longitude]).addTo(leaflet);
}

