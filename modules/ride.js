const mongoose = require("mongoose");

var rideSchema = new mongoose.Schema({
    date: Date,
    from: String,
    to: String,
    distance: Number,
    round_trip: Boolean,
    driver: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Ride", rideSchema);