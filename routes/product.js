const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");

/* GET users listing. */

router.use((req, res, next) => {
  console.log("A request is comong into product_api");
  next();
});

router.get("/", productController.findAllProduct);

router.get("/:id", productController.findOneProduct);

router.post("/", productController.postProduct);

router.put("/update/:id", productController.updateProduct);

router.delete("/delete/:id", productController.deleteProduct);

router.get("/:id", productController.findOneProduct);

module.exports = router;
