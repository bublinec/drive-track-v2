const mongoose = require("mongoose");

var rideSchema = new mongoose.Schema({
    date: Date,
    from: String,
    to: String,
    distance: Number,
    driver: String,
    round_trip: Boolean,
    // author: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User"
    //     },
    //     username: String
    // }
});

module.exports = mongoose.model("Ride", rideSchema);