const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  cardId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["employee", "management", "executive", "administrator"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  date: {
    type: String,
    default: new Date().toLocaleString("zh-TW"),
  },
  updateDate: {
    type: String,
    default: new Date().toLocaleString("zh-TW"),
  },
});

//schema middleware check password is hashed or not
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, isMatch);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
