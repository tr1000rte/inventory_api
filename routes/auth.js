const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const updateUserValidation = require("../validation").updateUserValidation;
const User = require("../models/userModel");

router.use((req, res, next) => {
  console.log("A request is comong into auth_api");
  next();
});

//get all user data
router.get("/", async (req, res) => {
  //確認是否登入且員工不可查看他人資料 (是否要分開寫)
  if (!req.session.isLogin || req.session.role == "employee") {
    res.status(403).send(`您無查看他人資料的權限或者登入後再進行操作`);
  }
  try {
    let data = await User.find();
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(`無法獲得使用者資料,error=> ${error}`);
  }
});

//get one user by id
//*****此判別式需修改*****
router.get("/:id", async (req, res) => {
  //確認是否登入
  if (!req.session.isLogin) {
    res.status(403).send(`請登入後再進行操作`);
  } else {
    //登入後
    try {
      let id = req.params.id;
      let data = await User.findById(id);
      console.log(data);
      if (
        data.cardId !== req.session.cardId ||
        req.session.role == "employee"
      ) {
        return res.status(403).send(`您無權限觀看他人資料`);
      }
      res.status(200).send(`您的資料${data}`);
    } catch (error) {
      res.status(404).send(`尋找資料過程發生問題=> ${error}`);
    }
  }
});

//update user data by id
router.put("/update/:id", async (req, res) => {
  let { error } = updateUserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let id = req.params.id;
  let data = await User.findById(id);
  let { firstName, lastName, role, password } = req.body;

  if (!data) {
    return res.status(404).send("查無此資料故無法進行修改");
  }
  if (
    //獲取該筆資料的人=登入的人
    `${data.userName.lastName}${data.userName.firstName}` == req.session.name
  ) {
    try {
      console.log(req.body.password);
      const newPwd = await bcrypt.hash(password, 10);
      console.log(newPwd);
      await User.findByIdAndUpdate(id, {
        userName: {
          firstName,
          lastName,
        },
        role,
        password: newPwd,
        //用Date.now()因return Number故使用toLocaleString後不設定依舊是Number，被誤認為currency
        // console.log(Date.now().toLocaleString("zh-TW"));
        updateDate: new Date().toLocaleString("zh-TW"),
      });

      res
        .status(200)
        .send(`ID:${id}資料已被修改於${new Date().toLocaleString("zh-TW")}`);
    } catch (error) {
      res.status(400).send(`修改過程發生錯誤=>${error}`);
    }
  } else {
    return res.status(403).send(`您無修改此資料權限`);
  }
});

//delete data by id
router.delete("/delete/:id", async (req, res) => {
  if (req.session.role == "administrator") {
    try {
      let id = req.params.id;
      await User.findByIdAndDelete({ _id: id });
      res
        .status(200)
        .send(`ID:${id}資料已被刪除於${new Date().toLocaleString("zh-TW")}`);
    } catch (error) {
      res.status(404).send(`刪除資料過程發生問題=> ${error}`);
    }
  } else {
    res.status(403).send("您無刪除此資料權限");
  }
});

//user register(created new suer)
router.post("/register", async (req, res) => {
  // console.log(req.body);
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { firstName, lastName, role, cardId, password } = req.body;

  //check user exist or not
  const userIdExist = await User.findOne({ cardId: req.body.cardId });
  if (userIdExist)
    return res.status(400).send("cardId has already been registered");

  //register the user
  const newUser = new User({
    userName: {
      firstName,
      lastName,
    },
    role,
    cardId,
    password,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send(`New user => ${savedUser}`);
  } catch (err) {
    res.status(400).send("User not saved.");
  }
});

//user login
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let data = await User.findOne({ cardId: req.body.cardId });
    if (!data) {
      res.status(401).send(`帳號密碼錯誤，請重新輸入 (找不到使用者)`);
    } else {
      data.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);
        if (isMatch) {
          req.session.role = data.role;
          req.session.isLogin = true;
          req.session.name = `${data.userName.lastName}${data.userName.firstName}`;
          // console.log(req.session);
          res
            .status(200)
            .send(`${req.session.role}${req.session.name}登入成功`);
        } else {
          res.status(401).send("帳號密碼錯誤，請重新輸入 (密碼錯誤)");
        }
      });
    }
  } catch (error) {
    res.status(400).send("登入期間發生未知錯誤");
  }
});

//user logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.status(200).send("已登出");
  });
  // res.render("login");
});
module.exports = router;
