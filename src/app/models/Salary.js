const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salarySchema = new Schema(
  {
    date: { type: Date },
    annualLeave:{type:Number},
    salary: { type: Number},
    overTime: { type: Number},
    staffId: {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true,
      },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Salary", salarySchema);
