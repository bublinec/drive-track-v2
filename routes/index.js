// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Ride = require("../modules/ride");
      


// ROUTES
router.get("/", function(req, res){
    res.redirect("/rides");
})

router.get("/dashboard", function(req, res){
    res.render("dashboard")
})

router.get("/rides", function(req, res){
    Ride.find({}, function(err, all_rides){
        if(err){
            console.log(err);
        }
        else{
            res.render("rides", {rides: all_rides});
        }
    });
})


router.post("/rides", middleware.isLoggedIn, function(req, res){
    Ride.create({
        distance: req.body.distance,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    }, function(err, created_ride){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/rides");
        }
    });
});


router.get("/drivers", function(req, res){
    res.render("drivers")
})



module.exports = router;