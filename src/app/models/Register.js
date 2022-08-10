const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RegisterSchema = new Schema(
  {
    date: { type: Object, },
    workPlace: { type: String },
    startWork: { type: String },
    endWork: { type: String },
    amountOfTime: { type: Number },
    annualLeave: {type:Number},
    overTime:{ type: Number},
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Register", RegisterSchema);
