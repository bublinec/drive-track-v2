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
    ]
});

module.exports = mongoose.model("Vehicle", vehicleSchema);