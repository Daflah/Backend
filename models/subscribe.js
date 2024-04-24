// subscribe.js

const mongoose = require('mongoose');

// Skema untuk data langganan email
const EmailSubscriptionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Pastikan email yang diinput unik
    },
    date_subscribed: {
        type: Date,
        default: Date.now
    }
});

// Membuat model berdasarkan skema
const EmailSubscription = mongoose.model('EmailSubscription', EmailSubscriptionSchema);

module.exports = EmailSubscription;
