const Product = require("../models/productModel");
const productTime = require("../models/productTimeModel");
const productValiation = require("../validation").productValiation;

const findAllProduct = async (req, res) => {
  try {
    resData = await Product.find();
    res.status(200).send(resData);
  } catch (error) {
    console.log(error);
  }
};

const findOneProduct = async (req, res) => {
  try {
    let id = req.params.id;
    resData = await Product.findById(id);
    res.status(200).send(resData);
  } catch (error) {
    console.log(error);
  }
};

const postProduct = async (req, res) => {
  const { error } = productValiation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { productName, description, price, quantity } = req.body;

  if (!req.session.role && req.session.isLogin !== true) {
    return res.status(403).send("請登入後進行再操作");
  }

  let newProduct = new Product({
    productName,
    description,
    price,
    quantity,
    postEmployee: req.session.name,
  });

  try {
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).send("新增商品時發生錯誤");
  }
};

//***使用商品號或商品ID用於update+mongoose ref應該會更好***因改變商品名後，刪除商品時會留下修改前的timestamp
const updateProduct = async (req, res) => {
  const id = req.params.id;

  // const { error } = productValiation(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  if (!req.session.role && req.session.isLogin !== true) {
    return res.status(400).send("請登入後進行再操作");
  } else {
    let data = await Product.findById(id);
    if (!data) {
      return res.status(400).send("查無此產品");
    }
    try {
      let splitData = JSON.stringify(req.body).split(":");
      let handleData = JSON.parse(
        splitData[1].slice(0, splitData[1].length - 1)
      );
      await Product.findByIdAndUpdate(id, req.body);
      let newTimestamp = new productTime({
        productId: id,
        employeeName: req.session.name,
        updateData: handleData,
        updateTime: new Date().toLocaleString("zh-TW"),
      });
      await newTimestamp.save();
      res
        .status(200)
        .send(`${req.session.name}已修改商品: ${data.productName}`);
    } catch (err) {
      res.status(400).send(err);
    }
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  if (!req.session.role && req.session.isLogin !== true) {
    return res.status(400).send("請登入後進行再操作");
  } else {
    let data = await Product.findById(id);
    if (!data) {
      return res.status(400).send("查無此商品故無法刪除");
    }
    try {
      await Product.findByIdAndDelete(id);
      await productTime.deleteMany({ productId: id });
      res.status(200).send(`商品"${data.productName}"已刪除`);
    } catch (err) {
      res.status(400).send(err);
    }
  }
};

const productTimestamp = async (req, res) => {};

module.exports.findAllProduct = findAllProduct;
module.exports.findOneProduct = findOneProduct;
module.exports.postProduct = postProduct;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
