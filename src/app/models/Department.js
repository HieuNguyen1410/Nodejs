const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    _id: { type: String },
    name: { type: String },
  },
  {
    timestamps: true,
    _id: false,
  }
);

module.exports = mongoose.model("Department", departmentSchema);
