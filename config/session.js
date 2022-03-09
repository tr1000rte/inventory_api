const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const sessionSetting = session({
  secret: process.env.SESSION_SCRECT,
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: "disabled",
  }),
});

module.exports = sessionSetting;
