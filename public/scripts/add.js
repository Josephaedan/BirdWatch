window.addEventListener("DOMContentLoaded", () => {
  var btn = document.getElementById("locationButton");
  var longitude = document.getElementById("longitude");
  var latitude = document.getElementById("latitude");
  var form = document.getElementById("form");

  if (btn) {
    btn.addEventListener("click", getLocation);
  }

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  latitude.value = position.coords.latitude;
  longitude.value = position.coords.longitude;
}

function loadFile(input) {
  var file = input.files[0];
  var newImage = document.getElementById("card-image-show");
  url = URL.createObjectURL(file);
  newImage.setAttribute("src", url);
}
