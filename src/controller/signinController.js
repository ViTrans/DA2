const { User } = require("../models/user");
const signIn = async (req, res) => {
  res.render("signIn", { title: "Đăng Nhập" });
};
const checkUser = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (!(await user.isValidPassword(password))) {
    res.redirect("/signin");
  } else {
    res.redirect("/");
  }
};
module.exports = {
  signIn,
  checkUser,
};
