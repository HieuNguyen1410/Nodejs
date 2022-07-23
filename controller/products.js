const Product = require("../models/product");

class productController {
  getAddProduct(req, res) {
    res.render("add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
    });
  }
  postAddProduct(req, res) {
    const product = new Product(req.body.title);
    product.save();
    res.redirect("/");
  }
  getProducts(req, res) {
    const products = Product.fetchAll((products) => {
      res.render("shop", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
      });
    });
  }
}

module.exports = new productController();
// exports.getAddProduct = (req, res) => {
//   res.render("add-product", {
//     pageTitle: "Add Product",
//     path: "/admin/add-product",
//     formsCSS: true,
//     productCSS: true,
//     activeAddProduct: true,
//   });
// };
// exports.postAddProduct = (req, res) => {
//   products.push({ title: req.body.title });
//   res.redirect("/");
// };
// exports.getProducts = (req, res) => {
//   res.render("shop", {
//     prods: products,
//     pageTitle: "Shop",
//     path: "/",
//     hasProducts: products.length > 0,
//     activeShop: true,
//     productCSS: true,
//   });
// };
