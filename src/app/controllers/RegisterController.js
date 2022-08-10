const Register = require("../models/Register");
const Staff = require("../models/Staff");
const Salary = require("../models/Salary");
const mongodb = require("mongodb");
const msToTime = require("../../util/getsumtime");
const { diffDays, splitTime } = require("../../util/getday");

const ObjectId = mongodb.ObjectId;

class RegisterController {
  //[GET] /register
  index(req, res, next) {
    const role = req.staff.role;
    const staffid = req.staff.id;
    if (!role || !staffid) {
      return next(new Error("Error !"));
    }

    Staff.findById(staffid)
      .then((staff) => {
        res.render("staffs/register", {
          status: staff.workingStatus.status,
          role,
        });
      })
      .catch((error) => {
        return next(err);
      });
  }

  //[POST] /register/startwork
  startWork(req, res, next) {
    const role = req.staff.role;
    const staff = req.staff;
    if (!role || !staff) {
      return next(new Error("Error !"));
    }
    res.render("register/start", {
      name: staff.name,
      role
    });
  }

  //[POST] /register/addstartwork
  postAddStartWork(req, res, next) {
    const role = req.staff.role;
    const d = new Date();
    const workPlace = req.body.workplace;
    const startWork =
      d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    const endWork = "";
    const amountOfTime = 0;
    const annualLeave = 0;
    const staffId = req.staff._id;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    const register = new Register({
      date: {
        day: d.getDate(),
        month: d.getMonth() + 1,
      },
      workPlace,
      startWork,
      endWork,
      amountOfTime,
      annualLeave,
      overTime: 0,
      staffId,
    });
    register
      .save()
      .then((result) => {
        Staff.findById(staffId)
          .then((staff) => {
            staff.workingStatus = {
              status: "On Working",
              registerId: new ObjectId(result.id),
            };
            return staff.save();
          })
          .then((staff) => {
            console.log("update status");
            res.render("staffs/register", {
              status: staff.workingStatus.status,
              role
            });
          })
          .catch((err) => {
            return next(err)
          });
        // res.render("staffs/register");
      })
      .catch((err) => {
        return next(err)
      });
  }

  //[POST] /register/endwork
  endWork(req, res, next) {
    const role = req.staff.role;
    const staff = req.staff;
    const registerId = staff.workingStatus.registerId;
    const d2 = new Date();
    const day = d2.getDate();
    const month = d2.getMonth() + 1;
    const year = d2.getFullYear();
    const endWork =
      d2.getHours() + ":" + d2.getMinutes() + ":" + d2.getSeconds();
      if (!role || !staff) {
        return next(new Error("Error !"));
      }
  
    Register.findOne({ _id: registerId })
      .then((register) => {
        const createdAt = register.createdAt;
        const times = msToTime(d2.getTime() - createdAt.getTime());
        register.endWork = endWork;
        register.amountOfTime = times.hours;
        return register.save();
      })
      .then((result) => {
        Staff.findOne({ _id: staff._id })
          .then((staff) => {
            staff.workingStatus = {
              status: "End Work",
              registerId: new ObjectId(registerId),
            };
            return staff.save();
          })
          .then((result) => {
            Register.find({
              date: { day: day, month: month },
              staffId: staff._id,
            })
              .then((registers) => {
                let overTime = 0;
                let amountOfTime = 0;
                registers.map((register) => {
                  return (amountOfTime += register.amountOfTime);
                });
                if (amountOfTime > 8) {
                  overTime = amountOfTime - 8;
                  Staff.findById(staff._id)
                    .then((staff) => {
                      staff.overTime += overTime;
                      return staff.save();
                    })
                    .then((result) => {
                      Register.findOne({ _id: registerId })
                        .then((result) => {
                          result.overTime = overTime;
                          return result.save();
                        })
                        .catch((error) => {
                          return next(error);
                        });
                    })
                    .then((result) => {
                      console.log("overTime updated");
                    })
                    .catch((err) => {
                      return next(err);
                    });
                }
                res.render("register/end", { registers, amountOfTime,role });
              })
              .catch((err) => {
                return next(err);
              });
          })
          .catch((err) => {
            return next(err);
          });
      })
      .catch((err) => {
        return next(err);
      });
  }

  //[get] /annualLeave
  getAnnualLeave(req, res, next) {
    const role = req.staff.role;
    const d = new Date().toISOString();
    const currentDays = d.substring(0, 10);
    if (!role) {
      return next(new Error("Error !"));
    }


    let isAnnualLeave = true;
    const annualLeave = req.staff.annualLeave;
    if (annualLeave === 0) {
      isAnnualLeave = false;
    }
    res.render("register/annualeave", {
      annualLeave: annualLeave,
      isAnnualLeave: isAnnualLeave,
      startdate: currentDays,
      enddate: "",
      reason: "",
      hours: "",
      role
    });
  }
  //[Post] /annualLeave
  postAddAnnualLeave(req, res, next) {
    const role = req.staff.role;
    const staff = req.staff;
    const registerId = staff.workingStatus.registerId;
    const reason = req.body.reason;
    const startdate = req.body.startdate;
    const enddate = req.body.enddate;
    const annualLeave = req.body.annualLeave;
    const numberOfHours = req.body.hours;
    const annualLeave_8 = annualLeave * 8;
    if (!role || !staff) {
      return next(new Error("Error !"));
    }

    if (numberOfHours > annualLeave_8) {
      return res.render("register/annualeave", {
        isAnnualLeave: true,
        annualLeave: annualLeave,
        startdate: startdate,
        enddate: enddate,
        reason: reason,
        hours: numberOfHours,
        role
      });
    }
    let days = 0;
    if (enddate === "" && numberOfHours === "") {
      days = 1;
    }
    if (startdate !== "" && enddate !== "" && numberOfHours === "") {
      days = diffDays(new Date(enddate), new Date(startdate));
    } else {
      days = numberOfHours / 8;
    }
    Register.findById(registerId)
      .then((register) => {
        register.annualLeave = days;
        return register.save();
      })
      .then((result) => {
        const annualLeaveStaff = staff.annualLeave;
        staff.annualLeave = annualLeaveStaff - days;
        return staff.save();
      })
      .then((result) => {
        res.redirect("/");
      })
      .catch((err) => {
        return next(err);
      });
  }
}

module.exports = new RegisterController();
