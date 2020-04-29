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

// middlewareObj.isAuthorized = function (req, res, next){
//     Pond.findById(req.params.id, function(err, foundPond){
//         if(err){
//             req.flash("error", "Not found!");
//             res.redirect("back");
//         }
//         else{
//             // if current user owns the pond continue to next
//             if(foundPond.author.id.equals(req.user._id)){
//                 next();
//             }
//             // else redirect back with a error flash
//             else{
//                 req.flash("error", "Permission denied!");
//                 res.redirect("back");
//             }
//         }
//     });
// }


module.exports = middlewareObj;