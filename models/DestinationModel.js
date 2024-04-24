const mongoose = require("mongoose");

// Definisikan skema model tujuan
const destinationSchema = new mongoose.Schema({
  destination: String,
  people: Number,
  checkin: Date,
  checkout: Date
});

// Buat model tujuan dari skema
const Destination = mongoose.model('Destination', destinationSchema);

// Fungsi untuk membuat instance model data tujuan
function createDestinationModel(destination, people, checkin, checkout) {
  return new Destination({
    destination,
    people,
    checkin,
    checkout
  });
}

// Fungsi untuk menyimpan data tujuan ke dalam "database"
async function saveDestination(destination) {
  try {
    // Simpan data tujuan ke dalam database
    const savedDestination = await destination.save();
    console.log('Data tujuan berhasil disimpan:', savedDestination);
  } catch (error) {
    console.error('Gagal menyimpan data tujuan:', error);
    throw error; // Dilemparkan untuk menangani kesalahan di atas
  }
}

module.exports = {
  createDestinationModel,
  saveDestination
};
