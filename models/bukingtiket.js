const mongoose = require("mongoose");

// Definisikan skema untuk data buking tiket
const bukingTiketSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
    },
    reviews: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

// Buat model BukingTiket dari skema yang telah didefinisikan
const BukingTiket = mongoose.model("BukingTiket", bukingTiketSchema);

module.exports = BukingTiket;
