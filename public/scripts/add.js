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
