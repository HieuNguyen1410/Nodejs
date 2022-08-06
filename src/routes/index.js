const staffsRouter = require("./staffs");
const registerRouter = require("./register");
const salaryRouter = require("./salary");
const covidRouter = require("./covid");

function route(app) {
  app.use("/staffs", staffsRouter);

  app.use("/register", registerRouter);

  app.use("/covid",covidRouter)

  app.use("/salary", salaryRouter);

  app.use("/", (req, res) => {
    res.render("home");
  });
}

module.exports = route;
