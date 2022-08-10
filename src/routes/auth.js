const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");
const { check, body } = require("express-validator/check");

router.post("/logout", authController.postLogout);

router.post(
  "/",
  check("email").isEmail().withMessage("Please Input Email!"),
  body("password")
    .isLength({ min: 2 })
    .withMessage("Please password more 2 index")
    .isAlphanumeric(),
  authController.postLogin
);

router.get("/", authController.getLogin);

module.exports = router;
