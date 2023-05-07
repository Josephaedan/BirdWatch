var express = require('express');
var router = express.Router();
const sightingController = require("../controllers/sightings");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('chat', { title: 'My Chat' });
});

/* GET Sightings */
router.get("/:id", function (req, res, next) {
    sightingController.getSightingComments(req, res);
});

/* POST Comment */
router.post("/:id", function (req, res, next) {
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);
    sightingController.addComment(req, res);
});

module.exports = router;
