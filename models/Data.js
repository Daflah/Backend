const mongoose = require("mongoose");

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
    required: true
  }
});

const Data = mongoose.model('Data', dataSchema); // Menggunakan mongoose.model() untuk membuat model

module.exports = Data;
