const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const covidSchema = new Schema(
  {
    temperature: { type: Object },
    vaccine: { type: Array },
    infected: { type: String },
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

module.exports = mongoose.model("Covid", covidSchema);
