// Dependencies:
const express = require("express"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      flash = require("connect-flash"),
      bodyParser = require("body-parser"),
      localStrategy = require("passport-local"),
      methodOverride = require("method-override");

// Models:
const Ride = require("./modules/ride"),
      User = require("./modules/user");

// Routes:
const authRoutes = require("./routes/auth"),
      rideRoutes = require("./routes/rides"),
      indexRoutes = require("./routes/index"),
      vehicleRoutes = require("./routes/vehicles");


// DB:
// mongoose.connect("mongodb://heroku_3r0400cl:7bfketltlgra774r6l9f26agdb@ds147450.mlab.com:47450/heroku_3r0400cl", {
//     useNewUrlParser: true, 
//     useUnifiedTopology: true,
//     useCreateIndex: true
// });

mongoose.connect("mongodb://localhost/drive-track", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});


// App configuration
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

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

// Pass variables to each template (flash requires sessions)
app.use(function(req, res, next){
    // whatever is in locals will be passed to the template
    // flash messages
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    
    if(req.user){
        // find user, populate and pass it to all templates
        User.findById(req.user._id).populate({
            path: "my_vehicles",
            populate: {
                path: "rides"
            }
        }).populate({
            path: "other_vehicles",
            populate: {
                path: "rides"
            }
        }).exec(function(err, populated_user){
            res.locals.current_user = populated_user;
            next(); // proceed to the next function
        });
    }
    else{
        next(); // proceed to the next function
    }    
});

// Routes
app.use("/vehicles", vehicleRoutes);
app.use("/vehicles/:id/rides", rideRoutes);
app.use("/", authRoutes);
app.use("/", indexRoutes);


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