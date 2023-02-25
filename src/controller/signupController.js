const User = require("../models/user");
const signUp = async (req, res) => {
  res.render("signUp", { title: "Đăng Ký" });
};
const createUser = async (req, res) => {
  const { username, password, email, phone } = req.body;
  const user = new User({
    username,
    password,
    email,
    phone,
  });
  try {
    await user.save();
    res.redirect("/signin");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  signUp,
  createUser,
};
