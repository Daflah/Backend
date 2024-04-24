const express = require("express");
const router = express.Router();
const Admin = require('../models/admin');
const multer = require('multer');
const admin = require("../models/admin");
const fs = require("fs");
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

router.post('/update/:id', upload, (req, res)=> {
    let id = req.params.id;
    let new_image = '';

    if (req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        } catch(err){
            console.log(err);
        }
    } else{
        new_image = req.body.old_image;
    }

    Admin.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    }, (err, result)=> {
        if(err){
            res.json({message:err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'User updated succesfully!',
            };
            res.redirect("/")
        }
    })
});


//Delete user route
router.get('/delete/:id', (req, res)=>{
    let id = req.params.id;
    Admin.findByIdAndRemove(id,(err,result)=> {
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/'+result.image);
            } catch (err){
                console.log(err);
            }
        }
        
        if(err){
            res.json({message: err.message});
        } else {
            req.session.message = {
                type: "info",
                message: "User Deleted Successfully!"
            };
            res.redirect("/");
        }
    })
})

module.exports = router;
