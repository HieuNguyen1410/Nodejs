const Salary = require("../models/Salary");
const Staff = require("../models/Staff");

class StaffsController {
  //[GET] /staffs
  index(req, res, next) {
    const staff = req.staff;
    res.render("staffs/getIndex", { staff: staff });
  }
  //[GET] /staff/:slug
  show(req, res, next) {
    console.log(req.staff.image);
    // res.send("show");
  }
  //[POST] staffs/Edit
  postEditStaff(req, res, next) {
    const staffId = req.body.id;
    const image = req.body.image;
    console.log(staffId, image);
    Staff.findById(staffId)
      .then((staff) => {
        staff.image = image;
        return staff.save();
      })
      .then((result) => {
        res.render("staffs/getIndex", { staff: result });
      })
      .catch((err) => {
        console.log(err);
      });
  }

}

module.exports = new StaffsController();
