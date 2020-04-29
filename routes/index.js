// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Ride = require("../modules/ride");
      

// Functions:
function isLoggedIn(req, res, next){
    // if logged in continue to the next function
    if(req.isAuthenticated()){
        return next();
    }
    // else redirect to login
    res.redirect("/login");
}


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


router.post("/rides", isLoggedIn, function(req, res){
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