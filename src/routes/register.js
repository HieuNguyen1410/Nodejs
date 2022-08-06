const express = require("express");
const router = express.Router();
const registerController = require("../app/controllers/RegisterController")

router.post("/addstartwork",registerController.postAddStartWork)
router.post("/startwork",registerController.startWork)
router.post("/endwork",registerController.endWork)
router.post('/addannualeave',registerController.postAddAnnualLeave)
router.get('/annualeave',registerController.getAnnualLeave)
router.get('/',registerController.index)

module.exports = router;
