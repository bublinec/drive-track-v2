// Dependencies:
const express = require("express"),
      mongoose = require("mongoose");
      router = express.Router({mergeParams: true}),
      Ride = require("../modules/ride"),
      Vehicle = require("../modules/vehicle"),
      middleware = require("../middleware");

// index - form is shown on the vehcile show route


// create
router.post("/", middleware.isLoggedIn, function(req, res){
    var new_ride = req.body.ride;
    // get date from string in the input
    var input_arr = req.body.date_input.split(".");
    date_str= input_arr[1] + "/" + input_arr[0] + "/" + input_arr[2];
    new_ride.date = new Date(date_str);
    console.log(new_ride.date);
    
    // get round trip checkbox
    if(req.body.round_trip == "on"){
        new_ride.round_trip = true;
    }
    else{
        new_ride.round_trip = false;
    }
    // get author
    // new_ride.author = {
    //     id: req.user._id,
    //     username: req.user.username
    // }
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
                // redirect to show route
                res.redirect("/vehicles/" + req.params.id);
            }
        });
    })

});

// destroy
router.delete("/:ride_id", middleware.isLoggedIn, function(req, res){
    // remove references from vehicle
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            found_vehicle.rides.remove(mongoose.Types.ObjectId(req.params.ride_id));
            found_vehicle.save();
        }
    });
    // remove ride itself
    Ride.findByIdAndDelete(req.params.ride_id, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
    });
    // redirect
    res.redirect("/vehicles/" + req.params.id);
});



module.exports = router;