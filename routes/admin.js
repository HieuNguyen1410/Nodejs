const express = require("express");

const router = express.Router();
// [GET] /admin/add-product
router.get("/add-product", (req, res) => {
  res.send(
    '<html><head></head><body><form action="/admin/add-product" method="POST"><input type="text" name="title"/><button type="submit">ADD-Product</button></form></body></html>'
  );
});
// [POST] /admin/add-product
router.post("/add-product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});
module.exports = router;
