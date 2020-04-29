// Dependencies:
const express = require("express"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      localStrategy = require("passport-local");

// Models:
const Ride = require("./modules/ride"),
      User = require("./modules/user");

// Routes:
const authRoutes = require("./routes/auth"),
      indexRoutes = require("./routes/index");

// DB:
mongoose.connect("mongodb://heroku_86qt99x8:hq1oqaop1m746569r2u08aojaj@ds123718.mlab.com:23718/heroku_86qt99x8", {useNewUrlParser: true, useUnifiedTopology: true});

// App configuration
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Passport configuration (order matters)
app.use(require("express-session")({
    secret: "This is a secret string used for hashing.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass current_user to each template (using middleware function)
app.use(function(req, res, next){
    // whatever is in locals will be passed to the template
    res.locals.current_user = req.user;
    next();
});

// routes
app.use("/", indexRoutes);
app.use("/", authRoutes);

// Start server
const port = process.env.PORT || 3000; 
app.listen(port, function(err){
    if(err){
        console.log(err);     
    }
    else{
        console.log("Server listening on the port: ", port);
    }
});