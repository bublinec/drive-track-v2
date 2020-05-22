// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      mongoose = require("mongoose"),
      Ride = require("../modules/ride"),
      Vehicle = require("../modules/vehicle"),
      User = require("../modules/user"),
      middleware = require("../middleware");


// index - all cars are displayed on the side nav

// new - form is displayed using modal

// create
router.post("/", middleware.isLoggedIn, function(req, res){ 
    // create vehicle and save it to db
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
            // redirect to vehicles page with a success flash message
            req.flash("success", created_vehicle.brand + " " + created_vehicle.model + " has been added to your account!");
            res.redirect("/vehicles/" + created_vehicle._id);
        }
    });
});


// show
router.get("/:id", middleware.isLoggedIn, middleware.isDriver, function(req, res){
    // find the vehicle with provided id
    Vehicle.findById(req.params.id).populate("rides").populate("drivers").exec(function(err, found_vehicle){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            // find users that are not drivers yet (don't know how to query it)   
            User.find({}, function(err, users){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    users_not_drivers = [];
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
router.put("/:id", middleware.isLoggedIn, middleware.isAuthor, function(req, res){
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
router.delete("/:id", middleware.isLoggedIn, middleware.isAuthor,  function(req, res){
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
                User.findById(driver._id, function(err, found_user){
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
            res.redirect("/dashboard/my_vehicles");
        }
    });
});

// add driver
router.post("/:id/drivers/:driver_id", middleware.isLoggedIn, middleware.isAuthor, function(req, res){
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
router.delete("/:id/drivers/:driver_id", middleware.isLoggedIn, middleware.isAuthor, function(req, res){
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
                        res.redirect("/dashboard/my_vehicles");
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