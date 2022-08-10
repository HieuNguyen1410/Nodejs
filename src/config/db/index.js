const mongoose = require("mongoose");

async function connect() {
  try {
    return await mongoose.connect("mongodb+srv://hieuroot:0000@cluster0.d2uhxrz.mongodb.net/employee", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    return error;
  }
}

module.exports = { connect };
