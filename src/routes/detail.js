const express = require("express");
const router = express.Router();
const detailsController = require("../app/controllers/DetailsController")

router.post('/salaryFind',detailsController.postSalary)

router.get('/',detailsController.getDetails)

module.exports = router;
