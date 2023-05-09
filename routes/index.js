var express = require('express');
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
  res.redirect("http://localhost:3000/sightings");
});

module.exports = router;
