var express = require('express');
var router = express.Router();
const sightingController = require("../controllers/sightings");

/* POST Comment */
router.post("/:id", function (req, res, next) {
    sightingController.addComment(req, res);
});

module.exports = router;
