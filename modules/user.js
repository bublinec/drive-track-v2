const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose"); 

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passport: String,
    vehicles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        }
    ]

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);