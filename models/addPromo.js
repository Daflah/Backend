const mongoose = require("mongoose");

    const promoSchema = new mongoose.Schema({
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

    const Promo = mongoose.model("Promo", promoSchema);

    module.exports = Promo;