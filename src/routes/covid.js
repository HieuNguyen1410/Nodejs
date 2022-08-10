const express = require("express");
const router = express.Router();
const covidController = require("../app/controllers/CovidController");
const { check, body } = require("express-validator/check");

router.post(
  "/addCovid",
  [
    body("temperature").isInt().withMessage("Please Input temperature"),
    body("injection1")
      .isLength({ min: 1 })
      .withMessage("Please Input injection1"),
    body("injection2")
      .isLength({ min: 1 })
      .withMessage("Please Input injection2"),
    body("date1").isLength({ min: 1 }).withMessage("Please Input date1"),
    body("date2").isLength({ min: 1 }).withMessage("Please Input date2"),
  ],
  covidController.postAddCovid
);

router.get("/covidDetails/invoice", covidController.getInvoice);

router.get("/covidDetails", covidController.getCovidDeatails);

router.get("/", covidController.getCovid);

module.exports = router;
