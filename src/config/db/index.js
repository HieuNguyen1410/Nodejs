const mongoose = require("mongoose");

async function connect() {
  try {
    return await mongoose.connect("mongodb://localhost:27017/employee", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    return error;
  }
}

module.exports = { connect };
