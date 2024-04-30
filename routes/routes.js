const express = require("express");
const router = express.Router();
const Admin = require('../models/admin');
const multer = require('multer');
const admin = require("../models/admin");
const fs = require("fs");
const Ride = require('../models/addRide');

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
router.get("/", async (req, res) => {
    try {
        const rides = await Ride.find(); // Mendapatkan data rides dari database
        res.render("index", { title: "Home", rides: rides }); // Mengirim data rides ke dalam template
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, type: 'danger' });
    }
});


module.exports = router;
