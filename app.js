const http = require("http");
const rootDir = require("./util/path");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

app.set("view engine", "pug");
app.set('views','views')

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/admin", adminData.routes);
app.use(shopRouter);

app.use((req, res) => {
  res.status(404).render('404',{pageTitle:404})
});

const port = 3000;

const server = http.createServer(app);

server.listen(port);
