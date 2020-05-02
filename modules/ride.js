const mongoose = require("mongoose");

var rideSchema = new mongoose.Schema({
    time: Date,
    destination: String,
    distance: Number,
    driver: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Ride", rideSchema);