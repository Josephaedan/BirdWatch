var express = require('express');
var router = express.Router();
const sightingController = require("../controllers/sightings");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('chat', { title: 'My Chat' });
});

/* GET Sightings */
router.get("/", function (req, res, next) {
    sightingController.getSightings(req, res);
});

/* POST Comment */
router.post("/comment", function (req, res, next) {
    req.params.id = "6457bf3360bd96a70994900b";  // TODO: CHANGE TO BE DYNAMIC
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);
    sightingController.addComment(req, res);
});

module.exports = router;
