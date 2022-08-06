const express = require("express");
const router = express.Router();
const covidController = require("../app/controllers/CovidController");

router.post('/addCovid',covidController.postAddCovid)

router.get("/", covidController.getCovid);

module.exports = router;
