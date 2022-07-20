const express = require("express");

const router = express.Router();

router.post("/product", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

router.get("/add-product", (req, res) => {
  res.send(
    '<html><head></head><body><form action="/product" method="POST"><input type="text" name="title"/><button type="submit">ADD-Product</button></form></body></html>'
  );
});

module.exports = router;
