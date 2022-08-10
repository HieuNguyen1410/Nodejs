const Salary = require("../models/Salary");
const Staff = require("../models/Staff");
const Register = require("../models/Register");
const Department = require("../models/Department");

class AdminController {
  //[GET] /
  getStaffs(req, res, next) {
    const departmentId = req.staff.departmentId;
    const role = req.staff.role;
    Staff.find({ departmentId: departmentId, role: "Staff" })
      .then((staffs) => {
        res.render("staffs/staffDetails", { staffs, role });
      })
      .catch((err) => [console.log(err)]);
  }
  //[GET] /admin/workcheck
  getWorkcheck(req, res, next) {
    const role = req.staff.role;
    const currentMonth = new Date().getMonth() + 1;
    const staffId = req.query.id;
    let edit = true;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    Staff.findById(req.query.id)
      .then((staff) => {
        edit = staff.edit;
      })
      .catch((err) => {
        return next(err);
      });
    Register.find({ staffId: staffId })
      .then((registers) => {
        res.render("staffs/workcheck", {
          registers,
          currentMonth,
          edit,
          staffId,
          role,
        });
      })
      .catch((err) => {
        return next(err);
      });

    // let ITEMS_PER_PAGE = +req.query.pageSize || 10;
    // const departmentId = req.staff.departmentId;

    // const page = +req.query.page || 1;
    // let totalRegister;

    // Register.find({staffId})
    //   .countDocuments()
    //   .then((numRegisters) => {
    //     totalRegister = numRegisters;
    //     return Register.find()
    //       .skip((page - 1) * ITEMS_PER_PAGE)
    //       .limit(ITEMS_PER_PAGE);
    //   })
    //   .then((registers) => {
    //     Staff.findOne({ departmentId: departmentId, role: "Admin" })
    //       .then((staff) => {
    //         res.render("staffs/workdetail", {
    //           registers,
    //           currentMonth,
    //           totalRegister: totalRegister,
    //           pageSize: ITEMS_PER_PAGE,
    //           currentPage: page,
    //           hasNextPage: ITEMS_PER_PAGE * page < totalRegister,
    //           hasPreviousPage: page > 1,
    //           nextPage: page + 1,
    //           previousPage: page - 1,
    //           lastPage: Math.ceil(totalRegister / ITEMS_PER_PAGE),
    //           adminId: staff._id,
    //           nameAdmin: staff.name,
    //         });
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
  //[GET] /delete
  getDelete(req, res, next) {
    const registerId = req.query.id;
    const role = req.staff.role;
    const staffId = req.query.staffId;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    Register.findById(registerId)
      .then((register) => {
        if (!register) {
          return next(new Error("Register not found."));
        }
        return Register.deleteOne({ _id: registerId });
      })
      .then((result) => {
        console.log(staffId);
        res.redirect(`/admin/workcheck/?id=${staffId}`);
      })
      .catch((err) => {
        return next(err);
      });
  }
  //[GET] /admin/confirm
  getConfirm(req, res, next) {
    const role = req.staff.role;
    const staffId = req.query.id;
    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    Staff.findById(staffId)
      .then((staff) => {
        staff.edit = false;
        return staff.save();
      })
      .then((result) => {
        res.redirect("/admin");
      })
      .catch((err) => {
        return next(err);
      });
  }
  //[POST] /admin/findMonth
  postFindMonth(req, res, next) {
    const role = req.staff.role;
    const month = +req.body.month;
    const staffId = req.query.id;
    
    let edit = true;
    const currentMonth = new Date().getMonth() + 1;

    if (!role || !staffId) {
      return next(new Error("Error !"));
    }

    Staff.findById(req.query.id)
      .then((staff) => {
        edit = staff.edit;
      })
      .catch((err) => {
        console.log(err);
      });
    Register.find({ staffId: staffId })
      .then((registers) => {
        const registerArr = registers.filter((r) => r.date.month === month);
        return registerArr;
      })
      .then((registers) => {
        res.render("staffs/workcheck", {
          registers,
          currentMonth,
          edit,
          staffId,
          role,
        });
      })
      .catch((err) => {
       return next(err);
      });
  }
}

module.exports = new AdminController();
