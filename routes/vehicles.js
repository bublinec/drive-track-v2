// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      mongoose = require("mongoose"),
      Ride = require("../modules/ride"),
      Vehicle = require("../modules/vehicle"),
      User = require("../modules/user"),
      middleware = require("../middleware");


// index - all cars are displayed ALSO on the side nav
// index = dashboard
router.get("/", middleware.isLoggedIn, function(req, res){
    res.render("vehicles/index");
})

// new - form is displayed using modal

// create
router.post("/", middleware.isLoggedIn, function(req, res){ 
    // create pond and save it to db
    vehicle = req.body.vehicle;
    vehicle.author = req.user._id;
    vehicle.drivers = [req.user._id];
    Vehicle.create(vehicle, function(err, created_vehicle){
        if(err){
            req.flash("error", err.message); 
            res.redirect("back");
        }
        else{
            req.user.my_vehicles.push(created_vehicle);
            req.user.save();
            console.log("\nCreated vehicle:\n", created_vehicle);
            // redirect to ponds page with a success flash message
            req.flash("success", created_vehicle.brand + " " + created_vehicle.model + " has been added to your account!");
            res.redirect("/vehicles/" + created_vehicle._id);
        }
    });
});


// show
router.get("/:id", middleware.isLoggedIn, function(req, res){
    // find the pond with provided id
    Vehicle.findById(req.params.id).populate("rides").populate("drivers").exec(function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            console.log("here");
            
            res.redirect("back");
        }
        else{    
            User.find({}, function(err, users){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    users_not_drivers = []
                    users.forEach(user => {
                        if(!(user.isAmong(found_vehicle.drivers)))
                            if(!(req.user._id.equals(user._id)))
                                users_not_drivers.push(user);
                        });
                    // render the show page
                    res.render("vehicles/show", {
                        vehicle: found_vehicle,
                        users: users_not_drivers
                    });
                }
            });
        }
    });
}) ;

// edit - form is displayed using modal

// update (where form submits to)
router.put("/:id", middleware.isLoggedIn, function(req, res){
    // find and update the vehicle
    Vehicle.findByIdAndUpdate(req.params.id, req.body.vehicle, function(err){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            // redirect with a succes flash message
            req.flash("success", "Vehicle updated!");
            res.redirect(req.params.id);
        }
    });
});

// destroy
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    // remove reference from user object
    req.user.my_vehicles.remove(mongoose.Types.ObjectId(req.params.id));
    req.user.save();
    // remove all rides associted with the vehicle
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            found_vehicle.rides.forEach(function(ride){
                Ride.findByIdAndRemove(ride, function(err){
                    if(err){
                        req.flash("error", err.message);
                        res.redirect("back");
                    }
                });
            });
            found_vehicle.drivers.forEach(function(driver){
                User.findById(driver_id, function(err, found_user){
                    if(err){f
                        req.flash("error", err.message);
                        res.redirect("back");
                    }
                    else{
                        found_user.other_vehicles.remove(mongoose.Types.ObjectId(req.params.id));
                        found_user.save();
                    }
                });
            });
            // remove the vehicle itself
            found_vehicle.remove();
            // redirect to index with a succes flash message
            req.flash("success", "Vehicle deleted!");
            res.redirect("/");
        }
    });
});

// add driver
router.post("/:id/drivers/:driver_id", middleware.isLoggedIn, function(req, res){
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            User.findById(req.params.driver_id, function(err, found_user){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    // add user to vehicle.drivers
                    found_vehicle.drivers.push(found_user);
                    found_vehicle.save();
                    // add vehicle to user other_vehicles
                    found_user.other_vehicles.push(found_vehicle);
                    found_user.save();
                    req.flash("success", "Driver added!");
                    res.redirect("/vehicles/" + req.params.id);
                }
            });
        }
    });
});


// remove driver
router.delete("/:id/drivers/:driver_id", middleware.isLoggedIn, function(req, res){
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            User.findById(req.params.driver_id, function(err, found_user){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    // remove user from vehicle.drivers
                    found_vehicle.drivers.remove(mongoose.Types.ObjectId(req.params.driver_id));
                    found_vehicle.save();
                    // remove user from user's other_vehicles
                    found_user.other_vehicles.remove(mongoose.Types.ObjectId(req.params.id));
                    found_user.save();
                    if(req.user._id.equals(found_user._id)){
                        req.flash("success", "Vehicle removed from your account!");
                        res.redirect("/vehicles");
                    }
                    else{
                        req.flash("success", "Driver removed!");
                        res.redirect("/vehicles/" + req.params.id);
                    }
                }
        });
    }});
});

module.exports = router;