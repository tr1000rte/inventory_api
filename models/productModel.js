const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String },
  productName: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  postEmployee: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
