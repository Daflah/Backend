const mongoose = require("mongoose");

// Define the schema for ticket booking data
const ticketBookingSchema = new mongoose.Schema({
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
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who booked the ticket
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// Create a model for Ticket Booking using the defined schema
const TicketBooking = mongoose.model("TicketBooking", ticketBookingSchema);

module.exports = TicketBooking;
