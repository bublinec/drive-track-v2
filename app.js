// Dependencies:
const express = require("express"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      bodyParser = require("body-parser"),
      flash = require("connect-flash"),
      localStrategy = require("passport-local");

// Models:
const Ride = require("./modules/ride"),
      User = require("./modules/user");

// Routes:
const authRoutes = require("./routes/auth"),
      indexRoutes = require("./routes/index"),
      rideRoutes = require("./routes/rides"),
      vehicleRoutes = require("./routes/vehicles");


// DB:
mongoose.connect("mongodb://localhost/drive-track", {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
});

// App configuration
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); // proceed to the next function
});

// routes
app.use("/vehicles", vehicleRoutes);
app.use("/rides", rideRoutes);
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