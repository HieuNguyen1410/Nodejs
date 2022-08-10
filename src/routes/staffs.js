const express = require("express");
const router = express.Router();
const staffsController = require("../app/controllers/StaffsController");

router.post("/edit", staffsController.postEditStaff);

router.get("/listStaff",staffsController.getListStaff)

router.get("/", staffsController.index);

module.exports = router;
