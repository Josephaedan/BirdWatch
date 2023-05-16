let name = null;
let roomNo = null;
let socket = io();

// Import fetcher for Sparql for DBPedia Searches
// const { sparqlEndpointFetcher } = require('fetch-sparql-endpoint');

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

    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        writeOnHistory('<b>' + userId + ' :</b> ' + chatText);
    });

    // Called when a message is to be sent
    const chatForm = document.getElementById("chatform");
    chatForm.addEventListener("submit", sendChatText);

    // Called when an identification is to be added to the sighting
    const identificationForm = document.getElementById("identificationForm");
    identificationForm.addEventListener("submit", sendIdentification);
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
 * Called when the user submits the identification form
 * It sends the identification to the server and saves it to the database.
 * In the event that the user is offline, the identification will be saved to IndexedDB
 * and sent when the user is back online.
 */
function sendIdentification(event) {
    event.preventDefault();

    // const sightingID = window.location.pathname.replace("/sightings/", "");

    // Submit post request to server
    // HandleSubmit is defined in public/scripts/identification-submit.js
    // and will save the request to IndexedDB if the user is offline
    handleSubmit(event);

    // Close popup and modify html


    return false;
}
