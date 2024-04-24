const { Schema, model } = require('mongoose');

// Skema untuk data promosi
const PromoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // Anda dapat mengubah tipe data sesuai dengan kebutuhan, misalnya Buffer untuk menyimpan gambar langsung ke dalam database
        required: true
    }
});

// Buat model Promo berdasarkan skema PromoSchema
const Promo = model('Promo', PromoSchema);

// Ekspor model Promo agar dapat digunakan di tempat lain
module.exports = Promo;
