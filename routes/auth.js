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
    // TO DO : PASSWORD CONFIRMATION
    newUser = {email: req.body.email, username: req.body.username}
    console.log(newUser);
    User.register(newUser, req.body.password, function(err, created_user){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
        // if successfully create a user, then login and redirect
        passport.authenticate("local")(req, res, function(){
            res.redirect("/rides");
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
    successRedirect: "rides",
    failureRedirect: "login"
}));

// log out
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});


module.exports = router;