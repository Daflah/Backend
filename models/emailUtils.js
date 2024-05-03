// emailUtils.js

// Import modul yang diperlukan
const EmailSubscription = require('./subscribe'); // Sesuaikan dengan nama model yang benar

// Fungsi untuk memeriksa apakah email sudah ada dalam database
const checkEmailExists = async (email) => {
  try {
    // Cari langganan email berdasarkan alamat email
    const subscription = await EmailSubscription.findOne({ email: email });

    // Jika langganan email ditemukan, kembalikan true (email sudah ada)
    // Jika tidak ditemukan, kembalikan false (email belum ada)
    return !!subscription;
  } catch (error) {
    // Tangani kesalahan jika terjadi
    console.error('Error checking email existence:', error);
    throw new Error('Error checking email existence');
  }
};

// Eksport fungsi checkEmailExists agar bisa digunakan di file lain
module.exports = { checkEmailExists };
