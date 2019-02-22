const mongoose = require("mongoose");
const { Schema } = mongoose;
const Category = require("./category");
let ProductSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  name: String,
  price: Number,
  image: String
});
module.exports = mongoose.model("Product", ProductSchema);
