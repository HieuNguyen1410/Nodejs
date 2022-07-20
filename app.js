const http = require("http");

const express = require("express");

const app = express();

const routes = require("./routes");

app.use((req, res, next) => {
  console.log('In the middlewave!');
  next();
});

app.use((req, res, next) => {
    console.log('In another the middlewave!');
})

const port = 3000;

const server = http.createServer(app);

server.listen(port);
