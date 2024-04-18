// promo.js

// Fungsi untuk mengambil promo diskon
function ambilPromo(promoId) {
    fetch('/ambil-promo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ promoId: promoId })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Gagal mengambil promo diskon.');
      }
      // Tampilkan pesan sukses atau lakukan penanganan lain sesuai kebutuhan
      alert('Promo diskon berhasil diambil!');
      // Atau lakukan sesuatu setelah pengguna berhasil mengambil promo diskon
    })
    .catch(error => {
      console.error('Error:', error);
      // Tampilkan pesan error atau lakukan penanganan lain sesuai kebutuhan
      alert('Gagal mengambil promo diskon. Silakan coba lagi.');
    });
  }
  