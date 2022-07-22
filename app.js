const http = require("http");
const rootDir = require("./util/path");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars")

const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

const app = express();

// app.engine('hbs',expressHbs({
//   layoutsDir:'views/layouts',
//   defaultLayout:'main-layout',
//   extname:'hbs'
// }));
app.set("view engine", "ejs");
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
