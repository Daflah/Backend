const mongoose = require("mongoose");

// Definisikan skema untuk data ride
const rideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        enum: ['Atlantis Ancol', 'Samudra Ancol', 'Sea World Ancol', 'Ecopark Ancol'],
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Buat model Ride dari skema yang telah didefinisikan
const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
