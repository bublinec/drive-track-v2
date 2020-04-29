// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Ride = require("../modules/ride"),
      Vehicle = require("../modules/vehicle"),
      middleware = require("../middleware");

module.exports = router;