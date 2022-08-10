const staffsRouter = require("./staffs");
const registerRouter = require("./register");
const detailRouter = require("./detail");
const covidRouter = require("./covid");
const adminRouter = require("./admin");
const authRouter = require("./auth");
const isAuth = require("../middlewave/is-auth");
const error = require("../app/controllers/error");

function route(app) {
  app.use("/staffs", isAuth, staffsRouter);

  app.use("/register", isAuth, registerRouter);

  app.use("/covid", isAuth, covidRouter);

  app.use("/details", isAuth, detailRouter);

  app.use("/login", authRouter);

  app.use("/admin", isAuth, adminRouter);

  app.get("/500", error.get500);
  
  app.use("/:slug", error.get404);

  app.use("/", isAuth, (req, res) => {
    const role = req.staff.role;
    res.render("home", { role });
  });
}

module.exports = route;
