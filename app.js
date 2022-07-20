const http = require("http");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/product',(req,res) =>{
    console.log(req.body);
    res.redirect('/');
})

app.use("/add-product", (req, res) => {
  res.send('<html><head></head><body><form action="/product" method="POST"><input type="text" name="title"/><button type="submit">ADD-Product</button></form></body></html>');

});

app.use("/", (req, res) => {
  res.send("Hello from Express.js");
});

const port = 3000;

const server = http.createServer(app);

server.listen(port);
