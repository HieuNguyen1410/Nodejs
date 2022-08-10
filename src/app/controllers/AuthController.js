const Register = require("../models/Register");
const Staff = require("../models/Staff");
const Salary = require("../models/Salary");
const Covid = require("../models/Covid");
const Department = require("../models/Department");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");

class AuthController {
  //[GET] /LOGIN
  getLogin(req, res, next) {
    let message = req.flash("error");
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: message,
      oldInput: {
        email: "",
        password: "",
      },
      validationErrors: [],
    });
  }

  //[POST] /Login
  postLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    // req.session.isLoggedIn = true;
    // res.redirect("/");
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: errors.array(),
      });
    }
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        console.log("User not found");
        return res.status(422).render("auth/login", {
          errorMessage: "Invalid email or password",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid password or email");
          res.redirect("/login");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
  }
  //[POST] /login/logout
  postLogout(req, res, next) {
    req.session.destroy((err) => {
      console.log(err);
      res.redirect("/login");
    });
  }
}

// const email = "sam@gmail.com";
// const password = "123";
// bcrypt
//   .hash(password, 12)
//   .then((hashPassword) => {
//     const user = new User({
//       email: email,
//       password: hashPassword,
//       staffId: "62efc1d8458309340491b7b8",
//     });
//     return user.save();
//   })
//   .then((result) => {
//     console.log("create user");
//   })
//   .catch((err) => {
//     const error = new Error(err);
//     error.httpStatusCode = 500;
//     return next(error);
//   });
module.exports = new AuthController();
