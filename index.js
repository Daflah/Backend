const express = require("express");
const bodyParser = require('body-parser'); // Test
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const TodoListItem = require('./models/TodoListitems');


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
const Data = mongoose.model('Data', dataSchema);

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

// kalau misal memakai banyak html bisa pake
app.get("/bla", (req,res) =>{
  res.render("bla.ejs");
});

app.listen(port, () => {
  console.log(`Webserver app listening port ${port}`);
});