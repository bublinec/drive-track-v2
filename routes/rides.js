// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      Ride = require("../modules/ride"),
      Vehicle = require("../modules/vehicle"),
      middleware = require("../middleware");

// index - form is shown on the vehcile show route


// create
router.post("/", middleware.isLoggedIn, function(req, res){
    new_ride = req.body.ride;
    new_ride.author = {
        id: req.user._id,
        username: req.user.username
    }
    new_ride.time = new Date();
    // lookup the vehicle from request
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        Ride.create(new_ride, function(err, created_ride){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }
            else{
                found_vehicle.rides.push(created_ride);
                found_vehicle.save();
                console.log(created_ride.time);
                
                // redirect to show route
                res.redirect("/vehicles/" + req.params.id);
            }
        });
    })

});


// router.get("/drivers", middleware.isLoggedIn, function(req, res){
//     res.render("drivers")
// })



module.exports = router;