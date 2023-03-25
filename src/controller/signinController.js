const User = require("../models/user");
const signIn = async (req, res) => {
  res.render("signIn", { title: "Đăng Nhập" });
};
const checkUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Tài khoản không tồn tại");
      req.flash("message", "Tài khoản không tồn tại");
      res.redirect("/signin");
    } else if (!(await user.isValidPassword(password))) {
      console.log("Sai mật khẩu");
      req.flash("message", "Sai mật khẩu");
      res.redirect("/signin");
    } else {
      req.session.user = user;
      req.flash("message", "Đăng nhập thành công");
      console.log("Đăng nhập thành công");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};
const logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/signin");
};
const checkUserLogin = async (req, res, next) => {
  console.log(req.session.user);
  if (req.session.user) {
    next();
  } else {
    res.redirect("/signin");
  }
};
module.exports = {
  signIn,
  checkUser,
  logout,
  checkUserLogin,
};
