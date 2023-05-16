/**
 * This file contains the JavaScript for the add page, which allows users to add a new sighting to the database.
 * It also contains the JavaScript for displaying the map and the location of the sighting. This is done using the Leaflet library and OpenStreetMap.
 */
let leaflet;
let marker;

// Default coordinates for Sheffield - Will be shown by default to the user upon loading the page
const SHEFFIELD_COORDINATES = [53.383331, -1.466667];

/**
 * Initialises the map and sets the view to Sheffield by default
 */
window.addEventListener("DOMContentLoaded", () => {
  var btn = document.getElementById("locationButton");
  var form = document.getElementById("form");
  var idFormBtn = document.getElementById("id-submit");

  if (btn) {
    btn.addEventListener("click", getLocation);
  }

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  if (idFormBtn) {
    idFormBtn.addEventListener("click", idSearch);
  }

  initialiseMap(SHEFFIELD_COORDINATES[0], SHEFFIELD_COORDINATES[1]);

});

/**
 * Gets the user's location and displays it on the map
 */
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      displayLocationOnMap(position.coords.latitude, position.coords.longitude);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

/**
 * When user searches for identification, posts a SPARQL Query to DBPedia
 * The results are updated to display in the table.
 */
async function idSearch() {
  // Stop the search if search box is empty
  if (document.getElementById("id-name-search").value === "") {
    window.alert("Search must not be empty!");
    return
  }

  // Remove display of previous results
  document.getElementById("identification-info").style.display = "none";

  // Remove any results if previously selected
  document.getElementById("id-common-name").textContent = "";
  document.getElementById("id-scientific-name").textContent = "";
  document.getElementById("id-description").textContent = "";
  document.getElementById("id-link").href = "";
  document.getElementById("id-link").textContent = "";


  console.log("Identification Search in progress...")
  const endpointUrl = 'https://dbpedia.org/sparql';
  const searchWords = document.getElementById("id-name-search").value;
  console.log(searchWords);
  const keywords = searchWords.split(" ");

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

    // The ID Table element to be updated
    const id_table_body = document.getElementById("id-table-body");

    // For each result, update the table
    for (let i = 0; i < results.results.bindings.length; i++) {
      const searchResult = results.results.bindings[0];
      const identification = {
        bird: searchResult.bird.value, // website link to dbpedia
        name: searchResult.name.value,
        description: searchResult.description.value,
        commonName: searchResult.commonName.value,
      };
      console.log(identification);

      // Update ID Table
      let id_row = id_table_body.insertRow(-1);

      // Create table cells in the row
      let col_commonName = id_row.insertCell(0);
      let col_scientificName = id_row.insertCell(1);
      let col_engDescription = id_row.insertCell(2);
      let col_link = id_row.insertCell(3);

      // Add data to columns
      col_commonName.innerText = identification.commonName !== null ? identification.commonName : '';
      col_scientificName.innerText = identification.name !== null ? identification.name : '';
      col_engDescription.innerText = identification.description !== null ? identification.description : '';
      col_link.innerText = identification.bird !== null ? identification.bird : '';

      // If the row is selected, run the selectRow function
      id_row.onclick = function () {
        selectIdRow(this);
      };
    }

    // Show the ID Table
    document.getElementById("id-table").style.display = "block";

  } catch (error) {
      console.error(`Error executing SPARQL query: ${error}`);
  }
}

/**
 * When the user selects a row from the displayed DBPedia entries
 * The selected row's information is captured and submitted with the form.
 */
function selectIdRow(row) {
  // Hide the table of results from search query
  document.getElementById("id-table").style.display = "none";

  // Remove any previous search
  const tbody = document.getElementById("id-table-body");
  while (tbody != null && tbody.rows.length > 1) {
    tbody.deleteRow(1);
  }

  // Show the result of the selected identification
  document.getElementById("identification-info").style.display = "block";

  // Get the values from the selected row
  const commonName = row.cells[0].innerText;
  const scientificName = row.cells[1].innerText;
  const engDescription = row.cells[2].innerText;
  const link = row.cells[3].innerText;

  // Perform any further actions with the selected values
  console.log('Selected Common Name: ', commonName);
  console.log('Selected Scientific Name: ', scientificName);
  console.log('Selected English Description: ', engDescription);
  console.log('Selected Link: ', link);

  // Update the 'identification-info' section with the relevant values and content
  document.getElementById("id-common-name").value = commonName;
  document.getElementById("id-scientific-name").value = scientificName;
  document.getElementById("id-description").value = engDescription;
  document.getElementById("id-link").value = link;
}

function showPosition(position) {
  latitude.value = position.coords.latitude;
  longitude.value = position.coords.longitude;
}

/**
 * Initialises the map view and adds a click event listener to the map
 */
function initialiseMap(latitude, longitude) {
  const map = document.getElementById("map");
  leaflet = L.map(map).setView([latitude, longitude], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(leaflet);

  // Add a click event listener to the map, and display the location of the click
  leaflet.on("click", function (e) {
    displayLocationOnMap(e.latlng.lat, e.latlng.lng);
  });
}

/**
 * Displays the new location on the map and updates the latitude and longitude input fields
 */
function displayLocationOnMap(newLatitude, newLongitude) {
  var latitude = document.getElementById("latitude");
  var longitude = document.getElementById("longitude");
  latitude.value = newLatitude;
  longitude.value = newLongitude;

  leaflet.setView([newLatitude, newLongitude]);

  if (marker) {
    leaflet.removeLayer(marker);
  }

  marker = L.marker([newLatitude, newLongitude]).addTo(leaflet);
}

/**
 * Loads the image file and displays it on the page
 */
function loadFile(input) {
  var file = input.files[0];
  var newImage = document.getElementById("card-image-show");
  url = URL.createObjectURL(file);
  newImage.setAttribute("src", url);
}
