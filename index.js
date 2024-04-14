const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const TodoListItem = require('./models/TodoListitems');
const Data = require('./models/Data'); // Pastikan path-nya sesuai

dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`MongoDB connected at ${process.env.MONGO_URL}`);
}).catch((err) => {
  console.log(err.message);
});

// Test
// Skema dan model untuk data yang akan disimpan
const dataSchema = new mongoose.Schema({
  name: String,
  email: String
});
// const Data = mongoose.model('Data', dataSchema);

// Middleware untuk parsing body dari permintaan POST
app.use(bodyParser.urlencoded({ extended: true }));

// app.post("/index", async (req, res) => {
//     try{
//       const {title, description} = req.body;
//       const newIndex = new TodoListitems({
//         title,
//         description
//       });
//       await newIndex.save();
//       res.redirect("/index");
//   } catch(error){
//     console.error(error);
//     res.status(500).send("Terjadi kesalahan saat menyimpan email")
//   }
// });

// Endpoint untuk pendaftaran pengguna
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Cari pengguna dengan email yang sama
    const existingUser = await Data.findOne({ email: email });
    if (existingUser) {
      // Jika email sudah digunakan, kirimkan pesan kesalahan
      return res.status(400).send('Email sudah digunakan, silakan gunakan email lain.');
    }
    // Buat pengguna baru
    const newUser = new Data({
      name: username,
      email: email,
      password: password
    });
    // Simpan pengguna baru ke dalam database
    const savedUser = await newUser.save();
    console.log('Data pengguna berhasil disimpan:', savedUser);
    // res.send('Pendaftaran berhasil.');
    res.redirect('/dashboard'); // Mengarahkan pengguna ke halaman dashboard setelah pendaftaran berhasil

  } catch (error) {
    console.error('Gagal mendaftar:', error);
    res.status(500).send('Gagal mendaftar.');
  }
});

// Endpoint untuk login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Cari pengguna berdasarkan email
    const user = await Data.findOne({ email: email });
    if (!user) {
      // Jika pengguna tidak ditemukan, kirimkan pesan kesalahan
      return res.status(404).send('Akun tidak ditemukan.');
    }
    // Validasi password
    if (user.password !== password) {
      // Jika password tidak cocok, kirimkan pesan kesalahan
      return res.status(401).send('Password salah.');
    }
    // Jika berhasil, kirimkan pesan login berhasil
    // res.send('Login berhasil.');
    res.redirect('/dashboard'); // Mengarahkan pengguna ke halaman dashboard setelah login berhasil
  } catch (error) {
    console.error('Gagal melakukan login:', error);
    res.status(500).send('Gagal melakukan login.');
  }
});


// Tambahkan penanganan permintaan POST untuk login
// app.post("/login", async (req, res) => {
//   try {
//       const { email, password } = req.body;
//       const newUser = new Data({
//           email: email,
//           password: password
//       });
//       const savedUser = await newUser.save();
//       console.log('Data pengguna berhasil disimpan:', savedUser);
//       res.send('Login berhasil.');
//   } catch (error) {
//       console.error('Gagal melakukan login:', error);
//       res.status(500).send('Gagal melakukan login.');
//   }
// });

// // Tambahkan penanganan permintaan POST untuk daftar
// app.post("/register", async (req, res) => {
//   try {
//       const { username, email, password } = req.body;
//       const newUser = new Data({
//           name: username,
//           email: email,
//           password: password
//       });
//       const savedUser = await newUser.save();
//       console.log('Data pengguna berhasil disimpan:', savedUser);
//       res.send('Pendaftaran berhasil.');
//   } catch (error) {
//       console.error('Gagal mendaftar:', error);
//       res.status(500).send('Gagal mendaftar.');
//   }
// });

app.post('/', async (req, res) => {
  try {
    const newTodoListItem = new TodoListItem({
      title: req.body.title,
      completed: req.body.completed || false,
      date: req.body.date || Date.now()
    });
    const savedTodoListItem = await newTodoListItem.save();
    console.log('Data berhasil disimpan:', savedTodoListItem);
    res.send('Data berhasil disimpan.');
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    res.status(500).send('Gagal menyimpan data.');
  }
});


app.get('/', async (req, res) => {
  try {
    const todoListItems = await TodoListItem.find({});
    res.render('index', { TodoListItems: todoListItems });
  } catch (error) {
    console.error('Gagal mendapatkan daftar item:', error);
    res.status(500).send('Gagal mendapatkan daftar item.');
  }
});


app.post('/index', async (req, res) => {
  try {
    const newTodoListItem = new TodoListItem({
      title: req.body.title,
      completed: req.body.completed || false,
      date: req.body.date || Date.now()
    });
    const savedTodoListItem = await newTodoListItem.save();
    console.log('Data berhasil disimpan:', savedTodoListItem);
    res.send('Data berhasil disimpan.');
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    res.status(500).send('Gagal menyimpan data.');
  }
});

// Endpoint untuk mendapatkan daftar item dalam to-do list
app.get('/index', async (req, res) => {
  try {
    const todoListItems = await TodoListItem.find({});
    res.render('index', { TodoListItems: todoListItems });
  } catch (error) {
    console.error('Gagal mendapatkan daftar item:', error);
    res.status(500).send('Gagal mendapatkan daftar item.');
  }
});

// Login



const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/todolistitems", require("./routes/api/todolistitems"));

//ejs
app.set("view engine", "ejs");
// app.set("views", path.join(_dirname, "views"));

//static
app.use(express.static("public"));

app.get("/", (req,res) => {
  res.render("index.ejs");
});

app.get("/index", (req,res) => {
  res.render("index.ejs");
});

app.get("/register", (req,res) => {
  res.render("index.ejs");
});

// kalau misal memakai banyak html bisa pake
app.get("/bla", (req,res) =>{
  res.render("index.ejs");
});

app.get("/dashboard", (req,res) =>{
  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Webserver app listening port ${port}`);
});
