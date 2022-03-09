const express = require("express");
const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.status(403).redirect("/login");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("landing");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/register", function (req, res, next) {
  res.render("register");
});

router.get("/dashboard", isAuth, function (req, res, next) {
  res.render("dashboard");
});

router.get("/upload", function (req, res, next) {
  res.render("upload");
});

module.exports = router;
