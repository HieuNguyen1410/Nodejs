const express = require("express");
const path = require("path");
const rootDir = require("../util/path");

const products = [];

const router = express.Router();
// [GET] /admin/add-product
router.get("/add-product", (req, res) => {
    res.render('add-product',{pageTitle:'Add Product',path:'/admin/add-product'})
});
// [POST] /admin/add-product
router.post("/add-product", (req, res) => {
  products.push({title: req.body.title})
  res.redirect("/");
});
exports.routes = router;
exports.products = products;
