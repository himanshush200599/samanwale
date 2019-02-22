const express = require("express");
const router = express.Router();
const Product = require("../models/product");

router.get("/", (req, res) => {
  res.render("main/home");
});

router.get("/products/:id", function(req, res, next) {
  Product.find({ category: req.params.id })
    .populate("category")
    .exec(function(err, products) {
      console.log(products);
      if (err) return next(err);
      res.render("main/category", {
        products
      });
    });
});
router.get("/product/:id", (req, res, next) => {
  Product.findById({ _id: req.params.id }, function(err, product) {
    if (err) return next(err);
    res.render("main/product", {
      product
    });
  });
});

module.exports = router;
