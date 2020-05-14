const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose"); 

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passport: String,
    my_vehicles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        }
    ],
    other_vehicles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle"
        }
    ]
});

userSchema.methods.isTheSameUser = function (user){
    if(this._id.equals(user._id))
        return true
    else
        return false
}

userSchema.methods.isAmong = function (users_arr){
    for(var i=0; i<users_arr.length;i++){
        if(this.isTheSameUser(users_arr[i]))
        return true
    }
    return false;
}

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
