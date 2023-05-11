let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    console.log("Chat room loaded!")

    // Connect to the room as shown in the URL
    const sightingID = window.location.pathname.replace("/sightings/", "");
    console.log("Sighting ID: ", sightingID)
    socket.emit('create or join', sightingID); // Connects to room

    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        writeOnHistory('<b>' + userId + ' :</b> ' + chatText);
    });
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via socket
 */

function sendChatText() {
    console.log("Sending chat message...");

    const sightingID = window.location.pathname.replace("/sightings/", "");
    let userNickname = document.getElementById('userNickname').value;
    let chatText = document.getElementById('text').value;

    console.log("User: ", userNickname);
    console.log("Chat text: ", chatText);
    console.log("SightingID: ", sightingID);

    socket.emit('chat', sightingID, userNickname, chatText);
    document.getElementById('chatform').method = 'POST';

    // Submit post request
    fetch(window.location + "/comments", {
        method: 'POST', // Specify the HTTP method
        headers: {'Content-Type': 'application/json'},
        body:  JSON.stringify({
            userNickname: userNickname,
            text: chatText,
        })
    })

    // Clear input fields for username and text
    // document.getElementById('userNickname').value = '';
    document.getElementById('text').value = '';

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