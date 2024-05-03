const mongoose = require("mongoose");

// Definisikan skema untuk data tiket
const ticketSchema = new mongoose.Schema({
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
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Buat model Ticket dari skema yang telah didefinisikan
const Ticket = mongoose.model("Add Ticket", ticketSchema);

module.exports = Ticket;
