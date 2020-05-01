const mongoose = require("mongoose");

var vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,
    mileage: Number,
    drivers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    rides: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride"
        }
    ]
});

module.exports = mongoose.model("Vehicle", vehicleSchema);