const express = require("express");
const router = express.Router();
const sightingController = require("../controllers/sightings");

// GET /sightings
router.get("/", function (req, res, next) {
  sightingController.getSightings(req, res);
});

// POST /sightings
router.post("/", function (req, res, next) {
  sightingController.addSighting(req, res);
});

// PUT /sightings/:id/identification
router.put("/:id/identification", function (req, res, next) {
  sightingController.updateIdentification(req, res);
});

// POST /sightings/:id/comments
router.post("/:id/comments", function (req, res, next) {
  sightingController.addComment(req, res);
});

module.exports = router;
