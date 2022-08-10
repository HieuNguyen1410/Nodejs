const express = require("express");
const handlebars = require("express-handlebars");
const path = require("path");
const pathMain = require("./util/path");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const multer = require("multer");
const session = require("express-session");
const flash = require("connect-flash");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const port = process.env.PORT || 3000;

const ObjectId = mongodb.ObjectId;

const route = require("./routes/index");
const db = require("./config/db");
const Staff = require("./app/models/Staff");

const store = new MongoDBStore({
  uri: "mongodb+srv://hieuroot:0000@cluster0.d2uhxrz.mongodb.net/employee",
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//set static files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/src/public/images",
  express.static(path.join(__dirname, "public", "images"))
);

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

//set multer
app.use(multer({ dest: "./public/images" }).single("image"));

app.use(flash());

//set session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//custom middlewave
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
//set req user
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  Staff.findById(req.session.user.staffId)
    .then((staff) => {
      req.staff = staff;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});


//set path images
const imagesPath = path.join(pathMain, "public", "images");
//Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "resources", "views"));

//Routes Init
route(app);

app.use((error, req, res, next) => {
  res.redirect("/500");
  res.status(500).render("500", {
    role: "",
    isAuthenticated: req.session.isLoggedIn,
  });
});

//connect mongoDB
db.connect()
  // .then((result) => {
  //   const date = new Date();
  //   Staff.findOne().then((staff) => {
  //     if (staff) {
  //       const staff = new Staff({
  //         name: "Kay",
  //         doB: date.toISOString(),
  //         salaryScale: 1,
  //         startDate: date.toISOString(),
  //         departmentId: "Dept02",
  //         annualLeave: 8,
  //         overTime: 1,
  //         salary: 1000,
  //         workingStatus: {
  //           status: "End Working",
  //         },
  //         role:'Staff',
  //         image: "https://bootdey.com/img/Content/avatar/avatar7.png",
  //       });
  //       staff.save();
  //     }
  //   });
  // })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
