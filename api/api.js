const router = require("express").Router();
const faker = require("faker");
const async = require("async");
const Product = require("../models/product");
const Category = require("../models/category");

router.get("/:name", (req, res, next) => {
  async.waterfall([
    function(callback) {
      Category.findOne({ name: req.params.name }, function(err, category) {
        if (err) return next(err);
        callback(null, category);
      });
    },
    function(category, callback) {
      for (var i = 0; i < 30; i++) {
        let product = new Product();
        product.category = category._id;
        product.name = faker.commerce.productName();
        product.price = faker.commerce.price();
        product.image = faker.image.image();

        product.save();
      }
    }
  ]);
  res.json({ message: "Success" });
});
module.exports = router;
