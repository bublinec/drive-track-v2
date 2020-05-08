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


module.exports = middlewareObj;