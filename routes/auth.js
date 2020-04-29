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
    newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, created_user){
        if(err){
            console.log(err);
            return res.render("/register");
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

// login lgic
router.post("/login", passport.authenticate("local", {
    successRedirect: "rides",
    failureRedirect: "login"
}));

// log out
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/rides");
});


module.exports = router;