const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const staffSchema = new Schema(
  {
    name: { type: String, require: true },
    doB: { type: Date, require: true },
    salaryScale: { type: Number, require: true },
    startDate: { type: Date, require: true },
    department: { type: String, require: true },
    annualLeave: { type: Number, require: true },
    overTime: { type: Number },
    salary: { type: Number },
    registerStatus: {
      status: { type: String },
      registerId: { type: String },
    },
    image: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

staffSchema.methods.addStartWork = function (staff) {
  staff.registerStatus.status = "On Working";
  return staff.save();
};
staffSchema.methods.addEndWork = function (staff) {
  staff.registerStatus.status = "End Working";
  staff.registerStatus.registerId = '';
  return staff.save();
};

module.exports = mongoose.model("Staff", staffSchema);
