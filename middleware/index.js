const Vehicle = require("../modules/vehicle");

middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    // if logged in continue to the next function
    if(req.isAuthenticated()){
        return next();
    }
    // else add new flash message and redirect to login
    req.flash("error", "Please log in first!")
    res.redirect("/login");
}

middlewareObj.isAuthor = function (req, res, next){
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", "Vehicle not found!");
            res.redirect("back");
        }
        else{
            // if current user owns the vehicle continue to next
            if(req.user.isTheSameUser(found_vehicle.author)){
                next();
            }
            // else redirect back with a error flash
            else{
                req.flash("error", "Permission denied!");
                res.redirect("back");
            }
        }
    });
}

middlewareObj.isDriver = function (req, res, next){
    Vehicle.findById(req.params.id, function(err, found_vehicle){
        if(err){
            req.flash("error", "Vehicle not found!");
            res.redirect("back");
        }
        else{
            // if current user is among drivers
            if(req.user.isAmong(found_vehicle.drivers)){
                next();
            }
            // else redirect back with a error flash
            else{
                req.flash("error", "Permission denied!");
                res.redirect("/dashboard/my_vehicles");
            }
        }
    });
}

middlewareObj.usernameToLowerCase = function (req, res, next){
    req.body.username = req.body.username.toLowerCase();
    next();
}


module.exports = middlewareObj;