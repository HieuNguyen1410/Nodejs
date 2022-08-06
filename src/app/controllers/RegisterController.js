const Register = require("../models/Register");
const Staff = require("../models/Staff");
const Salary = require("../models/Salary");
const mongodb = require("mongodb");
const getsumtime = require("../../util/getsumtime");
const { diffDays, splitTime } = require("../../util/getday");

const ObjectId = mongodb.ObjectId;

class RegisterController {
  //[GET] /register
  index(req, res, next) {
    const staffid = req.staff.id;
    const registerStatus = req.staff.registerStatus;
    Staff.findById(staffid)
      .then((staff) => {
        res.render("staffs/register", {
          status: registerStatus.status,
          endwork: false,
          registers: [],
          sumtime: 0,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //[POST] /register/startwork
  startWork(req, res, next) {
    const staff = req.staff;
    res.render("register/start", {
      name: staff.name,
    });
  }

  //[POST] /register/addstartwork
  postAddStartWork(req, res, next) {
    const d = new Date();
    const date = d.toISOString();
    const workplace = req.body.workplace;
    const startwork =
      d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    const endwork = "";
    const sumwork = 0;
    const annualLeave = 0;
    const staffId = req.staff._id;
    const register = new Register({
      date,
      workplace,
      startwork,
      endwork,
      sumwork,
      annualLeave,
      staffId,
    });
    register
      .save()
      .then((result) => {
        Staff.findById(staffId)
          .then((staff) => {
            staff.registerStatus.status = "On Working";
            staff.registerStatus.registerId = result.id;
            return staff.save();
          })
          .then((result) => {
            console.log("update status");
            res.render("staffs/register", {
              status: "On Working",
              endwork: false,
              registers: [],
              sumtime: 0,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        // res.render("staffs/register");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //[POST] /register/endwork
  endWork(req, res, next) {
    const staff = req.staff;
    const staffOverTime = req.staff.overTime;
    let overTime = 0;
    const d2 = new Date();
    const registerId = new ObjectId(req.staff.registerStatus.registerId);
    const endwork =
      d2.getHours() + ":" + d2.getMinutes() + ":" + d2.getSeconds();
    Register.findOne({ _id: registerId })
      .then((register) => {
        const createdAt = register.createdAt;
        const hours = d2.getHours() - createdAt.getHours();
        if (hours > 8) {
          overTime += hours - 8;
        }
        register.sumwork = hours;
        register.endwork = endwork;
        return register.save();
      })
      .then((register) => {
        Salary.findOne({ staffId: staff._id })
          .then((salary) => {
            salary.overTime = overTime;
            return salary.save();
          })
          .then((result) => {
            return req.staff.addEndWork(staff);
          })
          .catch((err) => {});
      })
      .then((result) => {
        Register.find({ staffId: req.staff._id })
          .then((registers) => {
            res.render("staffs/register", {
              status: "End Working",
              endwork: true,
              sumtime: getsumtime(registers),
              registers: registers,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log();
  }

  //[get] /annualLeave
  getAnnualLeave(req, res, next) {
    let isAnnualLeave = true;
    const annualLeave = req.staff.annualLeave;
    if (annualLeave === 0) {
      isAnnualLeave = false;
    }
    res.render("register/annualeave", {
      annualLeave: annualLeave,
      isAnnualLeave: isAnnualLeave,
      startdate: "",
      enddate: "",
      reason: "",
      hours: "",
    });
  }
  //[Post] /annualLeave
  postAddAnnualLeave(req, res, next) {
    const staffId = req.staff._id;
    const reason = req.body.reason;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const annualLeave = req.body.annualLeave;
    const numberOfHours = req.body.hours;
    const annualLeave_8 = annualLeave * 8;
    if (numberOfHours > annualLeave_8) {
      return res.render("register/annualeave", {
        isAnnualLeave: true,
        annualLeave: annualLeave,
        startdate: startdate,
        enddate: enddate,
        reason: reason,
        hours: numberOfHours,
      });
    }
    let days;
    if (enddate === "") {
      days = 1;
    }
    if (numberOfHours === "") {
      Staff.findById(staffId)
        .then((staff) => {
          staff.annualLeave = annualLeave - days;
          return staff.save();
        })
        .then((result) => {
          res.redirect("/");
        })
        .catch((err) => {
          console.error(err);
        });
    }
    Salary.findOne({ staffId: staffId })
      .then((salary) => {
        const annualLeave = salary.annualLeave + numberOfHours 
        salary.annualLeave = annualLeave;
        return salary.save();
      })
      .then((salary) => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = new RegisterController();
