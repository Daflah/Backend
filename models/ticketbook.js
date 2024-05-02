const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
