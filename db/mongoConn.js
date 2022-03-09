const mongoose = require("mongoose");
require("dotenv").config();

const mongoConn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected!!");
  } catch (error) {
    console.log("Fial to connect mongoDB => ", error);
  }
};

mongoConn();
