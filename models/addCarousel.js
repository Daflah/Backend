const mongoose = require("mongoose");

// Definisikan skema untuk data carousel
const carouselSchema = new mongoose.Schema({
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
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Buat model Carousel dari skema yang telah didefinisikan
const Carousel = mongoose.model("Carousel", carouselSchema);

module.exports = Carousel;
