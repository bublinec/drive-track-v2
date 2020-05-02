// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Ride = require("../modules/ride");
      


// ROUTES
router.get("/", middleware.isLoggedIn, function(req, res){
    res.redirect("/vehicles");
})


module.exports = router;