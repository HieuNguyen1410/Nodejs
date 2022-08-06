const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
  {
    date: { type: Date, require: true },
    workplace: { type: String },
    startwork: { type: String },
    endwork: { type: String },
    sumwork: { type: Number },
    annualLeave: {type:String},
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Register", RegisterSchema);
