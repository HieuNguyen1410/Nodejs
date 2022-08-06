const Register = require("../models/Register");
const Staff = require("../models/Staff");
const Salary = require("../models/Salary");
const Covid = require("../models/Covid");

class CovidController {
  // [GET] /covid
  getCovid(req, res, next) {
    res.render("staffs/covid");
  }
  //[POST] /covid/addAddCovid
  postAddCovid(req, res, next) {
    const staff = req.staff;
    const d = new Date();
    const temperature = req.body.temperature;
    const injection1 = req.body.injection1;
    const date1 = req.body.date1;
    const injection2 = req.body.injection2;
    const date2 = req.body.date2;
    const infected = req.body.infected;
    const covid = new Covid({
      temperature: {
        body: temperature,
        date: d,
      },
      vaccine: [
        { injection1: injection1, date1: date1 },
        { injection2: injection2, date2: date2 },
      ],
      infected: infected,
      staffId: staff._id,
    });
    covid
      .save()
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = new CovidController();
