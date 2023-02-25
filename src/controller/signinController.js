const { User } = require("../models/user");
const signIn = async (req, res) => {
  res.render("signIn", { title: "Đăng Nhập" });
};
const checkUser = async (req, res) => {
  // const { password, email } = req.body;
  // const user = await User.findOne({ email });
  // if (user) {
  //   if (user.password === password) {
  //     res.render("index", { title: "Trang Chủ" });
  //   } else {
  //     res.render("signIn", { title: "Đăng Nhập" });
  //   }
  // }
};
module.exports = {
  signIn,
  checkUser,
};
