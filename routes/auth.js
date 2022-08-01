const express = require("express");
const { check, body } = require("express-validator/check");
const authController = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

router.get("/login", authController.getLogin);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter your email")
    .custom((value, { req }) => {
      //   if (value === "abcd@gmail.com") {
      //     throw new Error("This Email is forbidden");
      //   }
      //   return true;
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email exist already");
        }
      });
    })
    .normalizeEmail(),
  body("password", "please enter password > 5")
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("ConFirmPassword is incorrect");
    }
    return true;
  }).trim(),
  authController.postSignup
);

module.exports = router;
