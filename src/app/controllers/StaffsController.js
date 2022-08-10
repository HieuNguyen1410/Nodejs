const Salary = require("../models/Salary");
const Staff = require("../models/Staff");
const Register = require("../models/Register");

class StaffsController {
  //[GET] /staffs
  index(req, res, next) {
    const role = req.staff.role;
    const staff = req.staff;
    if (!role || !staff) {
      return next(new Error("Error !"));
    }

    res.render("staffs/getIndex", { staff: staff, role });
  }
  //[GET] /staff/:slug
  show(req, res, next) {
    // console.log(req.staff.image);
    // res.send("show");
  }
  //[POST] staffs/Edit
  postEditStaff(req, res, next) {
    const role = req.staff.role;
    const image = req.file;
    const staff = req.staff;
    if (!role || !staff) {
      return next(new Error("Error !"));
    }

    if (!image) {
      return res.render("staffs/getIndex", { staff: staff, role });
    }
    const imageUrl = image.path;
    Staff.findById(staff._id)
      .then((staff) => {
        staff.image = imageUrl;
        return staff.save();
      })
      .then((result) => {
        res.render("staffs/getIndex", { staff: result, role });
      })
      .catch((err) => {
        return next(err);
      });
  }
  //[GET] /staffs/listStaff
  getListStaff(req, res, next) {
    const departmentId = req.staff.departmentId;
    const role = req.staff.role;
    if (!role) {
      return next(new Error("Error !"));
    }

    Staff.find({ departmentId: departmentId, role: "Staff" })
      .then((staffs) => {
        res.render("staffs/staffDetails", { staffs, role });
      })
      .catch((err) => next(err));
  }
}

module.exports = new StaffsController();
