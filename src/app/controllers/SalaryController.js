const Salary = require("../models/Salary");
const Staff = require("../models/Staff");
const Register = require("../models/Register");

class SalaryController {
  //[GET] /salary
  getSalary(req, res, next) {
    
    // const d = new Date('2022-09-06');
    // const staffId = req.staff._id;
    // Salary.findOne()
    //   .then((salary) => {
    //       const salarys = new Salary({
    //         date: d,
    //         annualLeave: 2,
    //         salary: 0,
    //         overTime: 4,
    //         staffId: staffId,
    //       });
    //       salarys.save();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    const staff = req.staff;
    Register.find({ staffId: staff._id })
      .then((registers) => {
        let sum = 0;
        for (let i = 0; i < registers.length; i++) {
          sum += registers[i].sumwork;
        }

        Salary.findOne({ staffId: staff._id })
          .then((salary) => {
            const month = salary.date.getMonth();
            const salaries =
              staff.salaryScale * 3000000 +
              (salary.overTime - (8 - sum)) * 200000;
            const annualLeave = salary.annualLeave;
            const overTime = salary.overTime;
            res.render("staffs/workdetail", {
              registers,
              annualLeave,
              sumwork: sum,
              overTime: overTime,
              salaries: salaries,
              month: month,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = new SalaryController();
