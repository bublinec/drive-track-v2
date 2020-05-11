const mongoose = require("mongoose");

var vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,
    mileage: Number,
    rides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride"
        }
    ],
    drivers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    author:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);