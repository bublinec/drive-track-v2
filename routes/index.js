// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Ride = require("../modules/ride");
      

// ROUTES
router.get("/", function(req, res){
    if(req.isAuthenticated()){
        res.redirect("/vehicles");
    }
    else{
        res.render("landing");
    }
})


module.exports = router;