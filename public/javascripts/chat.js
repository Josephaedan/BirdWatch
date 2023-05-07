let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // Connect to the room as shown in the URL
    const queryString = window.location.search;
    const sightingID = new URLSearchParams(queryString)
    socket.emit('create or join', sightingID);

    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });

}

// /**
//  * called to generate a random room number
//  * This is a simplification. A real world implementation would ask the server to generate a unique room number
//  * so to make sure that the room number is not accidentally repeated across uses
//  */
// function generateRoom() {
//     roomNo = Math.round(Math.random() * 10000);
//     document.getElementById('roomNo').value = 'R' + roomNo;
// }

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    console.log("Text was sent on chat")
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, name, chatText);
    window.location.reload();
}


/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}