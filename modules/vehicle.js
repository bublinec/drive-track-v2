const mongoose = require("mongoose");

var vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,
    initial_mileage: Number,
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

vehicleSchema.methods.getCurrentMileage = function(){
    current_mileage = this.initial_mileage;
    this.rides.forEach(ride => {
        current_mileage += ride.distance;
    });
    return current_mileage;
}

module.exports = mongoose.model("Vehicle", vehicleSchema);