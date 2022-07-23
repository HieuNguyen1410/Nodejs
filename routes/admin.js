const express = require("express");
const productController = require('../controller/products')
const path = require("path");

const router = express.Router();
// [GET] /admin/add-product
router.get("/add-product", productController.getAddProduct);
// [POST] /admin/add-product
router.post("/add-product", productController.postAddProduct);

module.exports = router;
