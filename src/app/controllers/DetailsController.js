const Salary = require("../models/Salary");
const Staff = require("../models/Staff");
const Register = require("../models/Register");
const Department = require("../models/Department");

class DetailsController {
  //[GET] /salary
  getDetails(req, res, next) {
    const role = req.staff.role;
    let ITEMS_PER_PAGE = +req.query.pageSize || 10;
    const departmentId = req.staff.departmentId;
    const staffId = req.staff._id;

    const page = +req.query.page || 1;
    let totalRegister;
    const currentMonth = new Date().getMonth() + 1;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    Register.find({ staffId: staffId })
      .countDocuments()
      .then((numRegisters) => {
        totalRegister = numRegisters;
        return Register.find({ staffId: staffId })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      })
      .then((registers) => {
        Staff.findOne({ departmentId: departmentId, role: "Admin" })
          .then((staff) => {
            res.render("staffs/workdetail", {
              registers,
              currentMonth,
              totalRegister: totalRegister,
              pageSize: ITEMS_PER_PAGE,
              currentPage: page,
              hasNextPage: ITEMS_PER_PAGE * page < totalRegister,
              hasPreviousPage: page > 1,
              nextPage: page + 1,
              previousPage: page - 1,
              lastPage: Math.ceil(totalRegister / ITEMS_PER_PAGE),
              adminId: staff._id,
              nameAdmin: staff.name,
              role
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
  //[POST] /details/salary
  postSalary(req, res, next) {
    const staffId = req.staff._id;
    const role = req.staff.role;
    const monthR = +req.body.month;
    const salaryScale = req.staff.salaryScale;
    let overTime = 0;
    let annualLeave = 0;
    let amountOfTime = 0;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }


    Register.find({ staffId: staffId })
      .then((registers) => {
        const registerArr = registers.filter((r) => r.date.month === monthR);
        return registerArr;
      })
      .then((registers) => {
        registers.map((value) => {
          console.log(value);
          amountOfTime += value.amountOfTime;
          overTime += value.overTime;
          annualLeave += value.annualLeave;
        });
        const leftHours = 8 * 24 - amountOfTime;
        console.log(amountOfTime);
        const salary =
          salaryScale * 3000000 + (amountOfTime - annualLeave * 8) * 200000;
        res.render("staffs/salary", {
          salaryScale,
          overTime,
          annualLeave,
          salary,
          monthR,
          role
        });
      })
      .catch((err) => {
        return next(err);
      });
  }
}

module.exports = new DetailsController();
