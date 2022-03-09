const mongoose = require("mongoose");

const productTimeSchema = new mongoose.Schema({
  productId: {
    type: String,
    require: true,
  },
  employeeName: {
    type: String,
    require: true,
  },
  updateData: {
    type: String,
    require: true,
  },
  updateTime: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("productTime", productTimeSchema);
