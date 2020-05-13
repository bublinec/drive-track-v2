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

router.get("/dashboard/my_vehicles", middleware.isLoggedIn, function(req, res){
    res.render("dashboard/my_vehicles");
});

router.get("/dashboard/my_driving", middleware.isLoggedIn, function(req, res){
    // find user's rides
    Ride.find({"driver.username": req.user.username}, function(err, found_rides){                
        res.render("dashboard/my_driving", {
            current_user_rides: found_rides
        });
    });
});


module.exports = router;