const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const sightingController = require("../controllers/sightings");
const multer = require("multer");

// Initialise multer and set the destination for uploaded files
// Code taken from Lab 'Week 11 Mongo - Upload Images 2 2'
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploads/");
  },
  filename: function (req, file, cb) {
    // Modify the filename to be the current timestamp
    // This ensures that each filename is unique
    var original = file.originalname;
    var file_extension = original.split(".");
    filename = Date.now() + "." + file_extension[file_extension.length - 1];
    cb(null, filename);
  },
});
var upload = multer({ storage: storage });

// GET /sightings - get all sightings sorted by date/time seen and identification status
router.get("/", function (req, res, next) {
  sightingController.getSightings(req, res);
});

// GET /sightings/add - get the form to add a new sighting
router.get("/add", function (req, res, next) {
  res.render("add");
});

// POST /sightings - add a new sighting
router.post("/add", upload.single("image"), async function (req, res, next) {
  sightingController.addSighting(req, res);
});

// GET /sightings/:id - get a single sighting
router.get("/:id", function (req, res, next) {
  sightingController.getSighting(req, res);
});

// GET /sightings/:id/identification - get a single sighting's identification
// router.get("/:id/identification", function (req, res, next) {
//   sightingController.getIdentification(req, res);
// });

// POST /sightings/:id/identification - update the identification of a sighting
router.post("/:id/identification", multer().none(), function (req, res, next) {
  sightingController.updateIdentification(req, res);
});

// POST /sightings/:id/comments - add a comment to a sighting
router.post("/:id/comments", multer().none(), function (req, res, next) {
  sightingController.addComment(req, res);
});

module.exports = router;
