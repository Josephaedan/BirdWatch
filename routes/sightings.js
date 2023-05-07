const express = require("express");
const router = express.Router();
const sightingController = require("../controllers/sightings");

// GET /sightings - get all sightings sorted by date/time seen and identification status
router.get("/", function (req, res, next) {
  sightingController.getSightings(req, res);
});

// GET /sightings/add - get the form to add a new sighting
router.get("/add", function (req, res, next) {
  res.render("add");
});

// POST /sightings - add a new sighting
router.post("/", function (req, res, next) {
  sightingController.addSighting(req, res);
});

// GET /sighitngs/:id - get a single sighting
router.get("/:id", function (req, res, next) {
  sightingController.getSighting(req, res);
});

// PUT /sightings/:id/identification - update the identification of a sighting
router.put("/:id/identification", function (req, res, next) {
  sightingController.updateIdentification(req, res);
});

// POST /sightings/:id/comments - add a comment to a sighting
router.post("/:id/comments", function (req, res, next) {
  sightingController.addComment(req, res);
});

module.exports = router;
