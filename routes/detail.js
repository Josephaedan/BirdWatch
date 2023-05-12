var express = require('express');
var router = express.Router();
const sightingController = require("../controllers/sightings");

/* POST Comment */
router.post("/:id", function (req, res, next) {
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);
    sightingController.addComment(req, res);
});

module.exports = router;
