const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const TodoListItem = require('./models/TodoListitems');
const Data = require('./models/Data');
const Subscribe = require('./models/subscribe');

// New
const session = require('express-session');

const ticketbook = require('./models/ticketbook');

// Import model dan fungsi dari file destination.js
const { createDestinationModel, saveDestination } = require('./models/DestinationModel');

dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log(`MongoDB connected at ${process.env.MONGO_URL}`);
}).catch((err) => {
  console.log(err.message);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}))
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false
  })
);

app.use((req,res,next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static('uploads'));

//routes prefix
app.use("", require('./routes/routes'))


// Test
// Skema dan model untuk data yang akan disimpan
const dataSchema = new mongoose.Schema({
  name: String,
  email: String
});
// const Data = mongoose.model('Data', dataSchema);

// Middleware untuk parsing body dari permintaan POST
app.use(bodyParser.urlencoded({ extended: true }));


// // Endpoint untuk menyimpan promo diskon yang dipilih oleh pengguna
// app.post("/promo-selection", async (req, res) => {
//   try {
//     const { title, description, image } = req.body;

//     // Simpan data promosi ke dalam database MongoDB
//     const newPromo = new Promo({
//       title: title,
//       description: description,
//       image: image
//     });
//     const savedPromo = await newPromo.save();
//     console.log('Data promosi berhasil disimpan:', savedPromo);

//     // Kirim respons ke pengguna bahwa data promosi berhasil disimpan
//     res.status(200).json({ message: 'Data promosi berhasil disimpan.' });
//   } catch (error) {
//     // Tangani kesalahan jika gagal menyimpan data promosi
//     console.error('Gagal menyimpan data promosi:', error);
//     res.status(500).json({ message: 'Gagal menyimpan data promosi.' });
//   }
// });
// // Endpoint untuk menyimpan data promosi ke MongoDB
// app.post("/redeem-promo", async (req, res) => {
//   try {
//     const { title, description, image } = req.body;
    
//     // Simpan data promosi ke MongoDB
//     const newPromo = new Promo({
//       title: title,
//       description: description,
//       image: image
//     });
//     const savedPromo = await newPromo.save();
//     console.log('Data promosi berhasil disimpan:', savedPromo);

//     // Berikan respons bahwa data berhasil disimpan
//     res.status(200).json({ message: 'Data promosi berhasil disimpan ke MongoDB.' });
//   } catch (error) {
//     console.error('Gagal menyimpan data promosi:', error);
//     res.status(500).json({ message: 'Gagal menyimpan data promosi.' });
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
    res.redirect('/userdashboard'); // Mengarahkan pengguna ke halaman dashboard setelah pendaftaran berhasil

  } catch (error) {
    console.error('Gagal mendaftar:', error);
    res.status(500).send('Gagal mendaftar.');
  }
});



// Endpoint untuk login
// Endpoint untuk login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Periksa apakah email adalah email admin
    if (email === 'admin@example.com') {
      // Validasi password untuk akun admin
      if (password !== 'adminpass') {
        return res.status(401).send('Password salah untuk akun admin.');
      }
      // Jika email adalah email admin dan password sesuai, langsung redirect ke halaman admin
      return res.redirect('/admin');
    }

    // Cari pengguna berdasarkan email
    const user = await Data.findOne({ email: email });
    if (!user) {
      // Jika pengguna tidak ditemukan, kirimkan pesan kesalahan
      req.session.message = {
        type: 'error',
        message: 'Akun tidak tersedia.'
      };
      // Mengarahkan pengguna kembali ke halaman login dengan pesan kesalahan
      return res.render('index', { errorMessage: req.session.message.message });
    }
    // Validasi password
    if (user.password !== password) {
      // Jika password tidak cocok, kirimkan pesan kesalahan
      return res.status(401).send('Password salah.');
    }
    // Jika berhasil, kirimkan pesan login berhasil
    req.session.message = {
      type: 'success',
      message: 'Login berhasil.'
    };
    // Mengarahkan pengguna ke halaman dashboard setelah login berhasil
    return res.redirect('/userdashboard');
  } catch (error) {
    console.error('Gagal melakukan login:', error);
    return res.status(500).send('Gagal melakukan login.');
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
});''

module.exports = {
  createDestinationModel,
  saveDestination
};

// Di sini Anda tidak perlu mengubah kode di destination.js


// Di dalam penanganan permintaan GET untuk halaman utama
app.get("/", async (req, res) => {
  try {
    // Ambil pesan dari session jika ada
    const inquireMessage = req.session.inquireMessage;
    const subscribeMessage = req.session.subscribeMessage;

    // Set inquireMessage ke null jika ada
    if (inquireMessage) {
      req.session.inquireMessage = null;
    } else {
      inquireMessage = null; // Set inquireMessage ke null jika tidak ada
    }

    // Render halaman dengan objek pesan yang didefinisikan di locals
    res.render("index", { inquireMessage, subscribeMessage });
  } catch (error) {
    console.error('Gagal merender halaman utama:', error);
    const inquireMessage = null; // Atur ke null jika terjadi kesalahan
    const subscribeMessage = req.session.subscribeMessage;
    res.status(500).send('Gagal merender halaman utama.');
  }
});


// Di dalam penanganan permintaan POST untuk rute "/inquire-now"
app.post("/inquire-now", async (req, res) => {
  try {
    const { destination, people, checkin, checkout } = req.body;

    // Buat model data tujuan menggunakan fungsi createDestinationModel
    const destinationModel = createDestinationModel(destination, people, checkin, checkout);

    // Simpan data tujuan menggunakan fungsi saveDestination
    await saveDestination(destinationModel);

    // Set pesan yang akan ditampilkan kepada pengguna
    req.session.inquireMessage = {
      type: 'success',
      message: 'Data tersimpan.'
    };

    // Redirect ke halaman yang sama (localhost:3000)
    res.redirect('/');

  } catch (error) {
    // Tangani kesalahan jika penyimpanan data gagal
    console.error('Gagal menyimpan data tujuan:', error);
    res.status(500).send('Gagal menyimpan data tujuan.');
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

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/todolistitems", require("./routes/api/todolistitems"));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));


// Menangani permintaan POST dari formulir langganan
app.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    // Buat objek EmailSubscription baru
    const newSubscription = new Subscribe({
      email: email
    });

    // Simpan langganan email ke dalam database
    const savedSubscription = await newSubscription.save();

    // Set pesan yang akan ditampilkan kepada pengguna
    req.session.subscribeMessage = {
      type: 'success',
      message: 'Thank you for subscribing!'
    };

    // Redirect ke halaman utama (localhost:3000)
    res.redirect('/');

  } catch (error) {
    // Tangani kesalahan
    console.error('Gagal menyimpan langganan email:', error);
    res.status(500).send('Gagal menyimpan langganan email.');
  }
});




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

app.get("/userdashboard", (req,res) =>{
  res.render("index.ejs");
});

app.get("/login", (req,res) =>{
  res.render("login.ejs");
});



app.listen(port, () => {
  console.log(`Webserver app listening port ${port}`);
});
