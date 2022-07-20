const http = require("http");

const express = require("express");

const app = express();

const routes = require("./routes");

app.use('/',(req, res, next) => {
  console.log('This always run!');
  next();
});

app.use('/add-product',(req, res) => {
    res.send('<h1>The add product page</h1>')
})

app.use('/',(req, res) => {
    console.log('In another the middlewave!');
    res.send('Hello from Express.js')
})

const port = 3000;

const server = http.createServer(app);

server.listen(port);
