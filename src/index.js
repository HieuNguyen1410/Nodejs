const express = require("express");
const morgan = require("morgan");
const handlebars = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const route = require("./routes/index");
const db = require("./config/db");
const Staff = require("./app/models/Staff");

//set static files
app.use(express.static(path.join(__dirname, "public")));

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//set req user  
app.use((req, res, next) => {
  Staff.findById("62ed037b14a1843210970b79")
    .then((staff) => {
      req.staff = staff;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

//HTTP log
// app.use(morgan("combined"));

//Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "resources", "views"));

//Routes Init
route(app);

//connect mongoDB
db.connect()
  .then((result) => {
    const date = new Date();
    Staff.findOne().then((staff) => {
      if (!staff) {
        const staff = new Staff({
          name: "Max",
          doB: date,
          salaryScale: 1,
          startDate: date,
          department: "Sale",
          annualLeave: 8,
          overTime: 1,
          salary: 1000,
          registerStatus:{
            status:'chua lam viec',
            registerId:''
          },
          image: "https://bootdey.com/img/Content/avatar/avatar7.png",
        });
        staff.save();
      }
    });
  })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
