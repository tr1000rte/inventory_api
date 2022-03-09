const Joi = require("joi");

const productValiation = (data) => {
  const schema = Joi.object({
    productName: Joi.string().min(6).max(50).required(),
    // .isError({ name: "error", message: "產品名稱最少6個字" }),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).required(),
    quantity: Joi.number().min(0).required(),
    // .isError({ name: "error", message: "價錢最少為10元" }),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    cardId: Joi.string().min(10).max(11).required(),
    password: Joi.string().min(6).max(255),
  });

  return schema.validate(data);
};

const updateUserValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required(),
    password: Joi.string().min(6).max(255).required(),
    // updateDate: Joi.string().required(),
  });

  return schema.validate(data);
};

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    cardId: Joi.string().min(10).max(11).required(),
    role: Joi.string().required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

module.exports.productValiation = productValiation;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateUserValidation = updateUserValidation;
