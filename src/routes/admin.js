const express = require("express");
const router = express.Router();
const adminController = require("../app/controllers/AdminController");

router.get("/workcheck", adminController.getWorkcheck);

router.get("/delete",adminController.getDelete)

router.get('/confirm',adminController.getConfirm)

router.post('/findMonth',adminController.postFindMonth)

router.get("/", adminController.getStaffs);

module.exports = router;
