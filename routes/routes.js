const express = require("express");
const router = express.Router();
const Admin = require('../models/admin');
const multer = require('multer');
const admin = require("../models/admin");
const fs = require("fs");
const Ride = require('../models/addRide');
const Carousel = require('../models/addCarousel');
const Promo = require('../models/addPromo');

// image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
});

var upload = multer({
    storage: storage
}).single("image");

// insert an admin into database route
router.post('/add', upload, async (req, res) => {
    try {
        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
        await admin.save(); // Menggunakan async/await untuk menunggu proses penyimpanan
        req.session.message = {
            type: 'success',
            message: 'Admin added successfully!'
        };
        res.redirect('/admin');
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Get all admins route
router.get("/admin", async (req, res) => {
    try {
        const admins = await Admin.find(); // Menarik semua data admin dari database
        res.render("admin", { title: "Dashboard Admin", admins: admins }); // Merender halaman admin dengan data admin yang diperoleh
    } catch (error) {
        res.status(500).json({ message: error.message, type: 'danger' }); // Menangani kesalahan jika terjadi
    }
});

router.get("/add", (req, res) => {
    res.render("add_user", { title: "Add Admin" })
});

// Edit an admin route 
router.get("/edit/:id", async (req, res) => { // Tambahkan async di sini
    try {
        let id = req.params.id;
        let admin = await Admin.findById(id); // Menggunakan await untuk menunggu hasil pencarian
        if (!admin) { // Jika admin tidak ditemukan
            return res.redirect("/edit_users");
        }
        res.render("edit_users", {
            title: "Edit User",
            admin: admin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

//update user route 

router.post('/update/:id', upload, async (req, res) => {
    try {
        let id = req.params.id;
        let new_image = '';

        if (req.file) {
            new_image = req.file.filename;
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            new_image = req.body.old_image;
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        if (!updatedAdmin) {
            return res.status(404).json({ message: 'User not found', type: 'danger' });
        }

        req.session.message = {
            type: 'success',
            message: 'User updated successfully!',
        };
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

//Delete user route
router.get('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const admin = await Admin.findById(id);
        
        if (!admin) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (admin.image !== '') {
            try {
                fs.unlinkSync('./uploads/' + admin.image);
            } catch (err) {
                console.log(err);
            }
        }

        await Admin.deleteOne({ _id: id });

        req.session.message = {
            type: "info",
            message: "User Deleted Successfully!"
        };
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Menampilkan halaman tambah ride
router.get("/add_rides", async (req, res) => {
    try {
        // Ambil data rides dari database atau dari sumber lainnya
        const rides = await Ride.find(); // Misalnya menggunakan model Ride dari MongoDB

        // Render halaman add_rides.ejs dengan data rides dan title
        res.render('add_rides', { title: "Add Rides", rides: rides });
    } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Menangani penambahan ride baru ke dalam database
// Kemudian Anda dapat menggunakan model Ride di dalam rute-rute Anda
router.post('/add_rides', upload, async (req, res) => {
    try {
        const ride = new Ride({
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
        });
        
        // Menyimpan ride baru ke dalam database
        await ride.save();

        // Menyiapkan pesan untuk ditampilkan setelah berhasil menambahkan ride
        req.session.message = {
            type: 'success',
            message: 'Ride added successfully!'
        };
        
        // Mengarahkan pengguna kembali ke halaman utama atau halaman yang sesuai
        res.redirect('/add_rides'); // Sesuaikan dengan rute yang diinginkan
    } catch (error) {
        // Menangani kesalahan jika terjadi
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

//tambahan untuk ke home
// router.get("/", async (req, res) => {
//     try {
//         const rides = await Ride.find(); // Mendapatkan data rides dari database
//         res.render("index", { title: "Home", rides: rides }); // Mengirim data rides ke dalam template
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message, type: 'danger' });
//     }
// });


// Edit ride route
router.get("/edit_ride/:id", async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found', type: 'danger' });
        }
        res.render('edit_rides', { title: "Edit Ride", ride: ride });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


// Delete ride route
// Delete ride route
router.post("/delete_ride/:id", async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found', type: 'danger' });
        }

        // Hapus foto ride dari sistem file jika ada
        const filePath = './uploads/' + ride.image;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.error("File not found:", filePath);
            // Jika file tidak ditemukan, kirim respons 404
            return res.status(404).json({ message: 'File not found', type: 'danger' });
        }

        // Hapus ride dari database
        await Ride.findByIdAndDelete(req.params.id);
        req.session.message = {
            type: 'info',
            message: 'Ride deleted successfully!'
        };
        res.redirect("/add_rides");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});



// Rute untuk memperbarui data ride
router.post('/update_ride/:id', upload, async (req, res) => {
    try {
        // Ambil ID ride dari parameter URL
        const id = req.params.id;

        // Inisialisasi variabel untuk menyimpan nama file gambar yang baru
        let newImage = '';

        // Periksa apakah ada file gambar baru diunggah
        if (req.file) {
            // Jika ada, simpan nama file gambar yang baru
            newImage = req.file.filename;

            // Hapus file gambar lama dari sistem file
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            // Jika tidak ada file gambar baru diunggah, gunakan nama file gambar lama
            newImage = req.body.old_image;
        }

        // Perbarui data ride di database
        const updatedRide = await Ride.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            image: newImage, // Gunakan nama file gambar yang baru
        });

        // Periksa apakah ride berhasil diperbarui
        if (!updatedRide) {
            // Jika tidak, kirim respons bahwa ride tidak ditemukan
            return res.status(404).json({ message: 'Ride not found', type: 'danger' });
        }

        // Jika berhasil, siapkan pesan sukses untuk ditampilkan
        req.session.message = {
            type: 'success',
            message: 'Ride updated successfully!',
        };

        // Redirect pengguna kembali ke halaman add_rides
        res.redirect("/add_rides");
    } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


router.get("/", async (req, res) => {
    try {
        const rides = await Ride.find(); // Mendapatkan data rides dari database
        const promos = await Promo.find(); // Mendapatkan data promos dari database
        res.render("index", { title: "Home", rides: rides, promos: promos }); // Mengirim data rides dan promos ke dalam template
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

router.get("/userdashboard", async (req, res) => {
    try {
        const rides = await Ride.find(); // Mendapatkan data rides dari database
        const promos = await Promo.find(); // Mendapatkan data promos dari database
        res.render("index", { title: "User Dashboard", rides: rides, promos: promos }); // Mengirim data rides dan promos ke dalam template
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

router.get("/login", async (req, res) => {
    try {
        const rides = await Ride.find(); // Mendapatkan data rides dari database
        const promos = await Promo.find(); // Mendapatkan data promos dari database
        res.render("index", { title: "User Dashboard", rides: rides, promos: promos }); // Mengirim data rides dan promos ke dalam template
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


// Menampilkan halaman tambah carousel
router.get("/add_carousel", async (req, res) => {
    try {
        // Ambil data carousel dari database atau sumber lainnya
        const carousels = await Carousel.find(); // Misalnya menggunakan model Carousel dari MongoDB

        // Render halaman add_carousel.ejs dengan data carousel dan title
        res.render('add_carousel', { title: "Add Carousel", carousels: carousels });
    } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Menangani penambahan carousel baru ke dalam database
router.post('/add_carousel', upload, async (req, res) => {
    try {
        // Dapatkan data dari form
        const { title, description } = req.body;
        const image = req.file.filename; // Gunakan filename dari file yang diunggah
        
        // Buat objek baru untuk carousel
        const newCarousel = new Carousel({
            title: title,
            description: description,
            image: image // Gunakan nama file gambar yang diunggah
        });
        
        // Menyimpan carousel baru ke dalam database
        await newCarousel.save();
        
        // Menyiapkan pesan untuk ditampilkan setelah berhasil menambahkan carousel
        req.session.message = {
            type: 'success',
            message: 'Carousel added successfully!'
        };
        
        // Mengarahkan pengguna kembali ke halaman tambah carousel atau halaman yang sesuai
        res.redirect('/add_carousel'); // Sesuaikan dengan rute yang diinginkan
    } catch (error) {
        // Menangani kesalahan jika terjadi
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


// Menampilkan halaman edit carousel berdasarkan ID carousel
router.get("/edit_carousel/:id", async (req, res) => {
    try {
        // Cari carousel berdasarkan ID yang diberikan
        const carousel = await Carousel.findById(req.params.id);
        
        // Periksa apakah carousel ditemukan
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found', type: 'danger' });
        }
        
        // Render halaman edit_carousel.ejs dengan data carousel dan title
        res.render('edit_carousel', { title: "Edit Carousel", carousel: carousel });
    } catch (error) {
        // Tangani kesalahan jika terjadi
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


// Delete carousel route
router.post("/delete_carousel/:id", async (req, res) => {
    try {
        // Cari carousel berdasarkan ID yang diberikan
        const carousel = await Carousel.findById(req.params.id);

        // Periksa apakah carousel ditemukan
        if (!carousel) {
            return res.status(404).json({ message: 'Carousel not found', type: 'danger' });
        }

        // Hapus foto carousel dari sistem file jika ada
        const filePath = './uploads/' + carousel.image;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            console.error("File not found:", filePath);
            // Jika file tidak ditemukan, kirim respons 404
            return res.status(404).json({ message: 'File not found', type: 'danger' });
        }

        // Hapus carousel dari database
        await Carousel.findByIdAndDelete(req.params.id);
        req.session.message = {
            type: 'info',
            message: 'Carousel deleted successfully!'
        };
        res.redirect("/add_carousel");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// Route to update carousel data
router.post('/update_carousel/:id', upload, async (req, res) => {
    try {
        // Get carousel ID from URL parameter
        const id = req.params.id;

        // Initialize a variable to store the new image file name
        let newImage = '';

        // Check if there is a new image file uploaded
        if (req.file) {
            // If there is, save the new image file name
            newImage = req.file.filename;

            // Delete the old image file from the file system
            try {
                fs.unlinkSync('./uploads/' + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            // If there is no new image file uploaded, use the old image file name
            newImage = req.body.old_image;
        }

        // Update carousel data in the database
        const updatedCarousel = await Carousel.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description,
            image: newImage, // Use the new image file name
        });

        // Check if the carousel was successfully updated
        if (!updatedCarousel) {
            // If not, send a response that the carousel was not found
            return res.status(404).json({ message: 'Carousel not found', type: 'danger' });
        }

        // If successful, prepare a success message to be displayed
        req.session.message = {
            type: 'success',
            message: 'Carousel updated successfully!',
        };

        // Redirect the user back to the add_carousel page
        res.redirect("/add_carousel");
    } catch (error) {
        // Handle errors if any
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});

// halaman tambah promo
router.get("/add_promo", async (req, res) => {
    try {
        const promos = await Promo.find(); 
        res.render("add_promo", { title: "Add New Promo", promos: promos }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


// Menangani penambahan promo baru
router.post('/add_promo', upload, async (req, res) => {
    try {
        const promo = new Promo({
            title: req.body.title,
            description: req.body.description,
            image: req.file.filename,
        });

        // Menyimpan promo baru ke dalam database
        await promo.save();

        // Menyiapkan pesan untuk ditampilkan setelah berhasil menambahkan promo
        req.session.message = {
            type: 'success',
            message: 'Promo added successfully!'
        };

        // Mengarahkan pengguna kembali ke halaman utama
        res.redirect('/add_promo');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});
// router.get("/", async (req, res) => {
//     try {
//         const carousels = await Carousel.find(); // Mendapatkan data carousel dari database
//         console.log(carousels); // Tambahkan log ini untuk memeriksa apakah data carousel berhasil diambil
//         res.render("index", { title: "Home", carousels: carousels }); // Mengirim data carousel ke dalam template
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message, type: 'danger' });
//     }
// });




module.exports = router;
