// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      middleware = require("../middleware"),
      Ride = require("../modules/ride");
      


// ROUTES
router.get("/", middleware.isLoggedIn, function(req, res){
    res.redirect("/vehicles");
})


// router.get("/rides", middleware.isLoggedIn, function(req, res){
//     Ride.find({}, function(err, all_rides){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         }
//         else{
//             res.render("rides", {rides: all_rides});
//         }
//     });
// })


// router.post("/rides", middleware.isLoggedIn, function(req, res){
//     Ride.create({
//         distance: req.body.distance,
//         author: {
//             id: req.user._id,
//             username: req.user.username
//         }
//     }, function(err, created_ride){
//         if(err){
//             req.flash("error", err.message);
//             res.redirect("back");
//         }
//         else{
//             res.redirect("/rides");
//         }
//     });
// });


// router.get("/drivers", middleware.isLoggedIn, function(req, res){
//     res.render("drivers")
// })



module.exports = router;