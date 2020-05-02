const mongoose = require("mongoose");

var rideSchema = new mongoose.Schema({
    distance: Number,
    start: String,
    end: String,
    destination: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("Ride", rideSchema);