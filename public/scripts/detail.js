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
    console.log("Chat room loaded!")

    // Connect to the room as shown in the URL
    const sightingID = window.location.pathname.replace("/sightings/", "");
    console.log("Sighting ID: ", sightingID)
    socket.emit('create or join', sightingID); // Connects to room

    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        writeOnHistory('<b>' + userId + ' :</b> ' + chatText);
    });

    // fetch data
    executeSPARQLQuery(['Cactus', 'Wren', 'Campylorhynchus', 'brunneicapillus']);
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

/**
 * Embed SPARQL Query into NodeJS App
 * Executes a SPARQL Query from the inputted keywords, and updates the identification description
 */
async function executeSPARQLQuery(keywords) {
    console.log("Executing query to DBPedia...")

    const endpointUrl = 'https://dbpedia.org/sparql';

    const sparqlQuery = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX dbp: <http://dbpedia.org/property/>
    
        SELECT ?bird ?name ?description ?commonName
        WHERE {
          ?bird rdf:type dbo:Bird ;
                rdfs:label ?name ;
                dbo:abstract ?description ;
                rdfs:label ?commonName .
          FILTER(LANG(?description) = 'en' && (${keywords.map(keyword => `CONTAINS(?name, "${keyword}")`).join(' || ')}))
          FILTER(LANG(?commonName) = 'en')
        }
  `;

    try {
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                query: sparqlQuery,
                format: 'json',
            }),
        });

        const results = await response.json();
        console.log(results);

        // Accessing a specific variable
        const birdFirstResult = results.results.bindings[0];
        const identification = {
            bird: birdFirstResult.bird.value, // website link to dbpedia
            name: birdFirstResult.name.value,
            description: birdFirstResult.description.value,
            commonName: birdFirstResult.commonName.value,
        };
        console.log(identification);

        // Update description section
        const description_element = document.getElementById("id_description");
        description_element.innerHTML +=
            "<br> Website: <a href=" + identification.bird + " target='_blank'>" + identification.bird + "</a>"
            + "<br><br> Scientific Name: " + identification.name
            + "<br><br> Common Name: " + identification.commonName
            + "<br><br> DBPedia Description: <br>" + identification.description;


    } catch (error) {
        console.error(`Error executing SPARQL query: ${error}`);
    }
}
