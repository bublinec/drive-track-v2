// Dependencies:
const express = require("express"),
      router = express.Router({mergeParams: true}),
      passport = require("passport"),
      User = require("../modules/user");


// register form
router.get("/register", function(req, res){
    res.render("register");
});

// register logic
router.post("/register", function(req, res){
    // check password confirmation
    if(req.body.password != req.body.confirm_password){
        req.flash("error", "Passwords do not match");
        res.redirect("back");
    }
    // check password length
    if(req.body.password.length < 6){
        req.flash("error", "Password needs to be at least 6 characters long");
        res.redirect("back");
    }
    newUser = {email: req.body.email, username: req.body.username}
    User.register(newUser, req.body.password, function(err, created_user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        // if successfully create a user, then login and redirect
        passport.authenticate("local")(req, res, function(){
            welcome_message = "Welcome " + req.body.username + "! On this page you will see your driving data. Tap 'Vehicles' on the side bar to add new vehicle and add your first ride!"
            req.flash("success", welcome_message);
            res.redirect("/vehicles");
        });
    });
});

// login form
router.get("/login", function(req, res){
    res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", {
    // TO DO : FIGURE OUT THE FLASH MESSAGES
    successRedirect: "/vehicles",
    failureRedirect: "/login",
    failureFlash : true
}));

// log out
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});


module.exports = router;