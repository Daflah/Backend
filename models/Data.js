const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const dataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Pastikan setiap email unik di database
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimal 6 karakter
    maxlength: 255 // Maksimal 255 karakter
  }
});

// Mengekripsi password sebelum disimpan
// dataSchema.pre('save', async function(next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const Data = mongoose.model('Data', dataSchema); // Menggunakan mongoose.model() untuk membuat model

module.exports = Data;
