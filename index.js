const express = require("express");
const app = express();
//const path = require("path");
const port = 3000;

    //ejs
app.set("view engine", "ejs");
//app.set("views", path.join(_dirname, "views"));

    //static
app.use(express.static("public"));

app.get("/", (req,res) => {
  res.render("index.ejs");
});

app.get("/index", (req,res) => {
  res.render("index.ejs");
});

    //kalau misal memakai banyak html bisa pake
// app.get("/bla", (req,res) =>{
//   res.render("bla.ejs");
// });


app.listen(port, () => {
  console.log(`Webserver app listening port ${port}`);
});