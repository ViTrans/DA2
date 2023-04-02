const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signIn = async (req, res) => {
  res.render('signIn', { title: 'Đăng Nhập' });
};

generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log('user infor ', user);
    if (!user) {
<<<<<<< Updated upstream
      res.status(400).json({ message: "Không tìm thấy tài khoản" });
    } else if (!(await user.isValidPassword(password))) {
      console.log("Sai mật khẩu");
      res.status(400).json({ message: "Sai mật khẩu" });
=======
      console.log('Tài khoản không tồn tại');
      req.flash('message', 'Tài khoản không tồn tại');
      res.redirect('/signin');
    } else if (!(await user.isValidPassword(password))) {
      console.log('Sai mật khẩu');
      req.flash('message', 'Sai mật khẩu');
      res.redirect('/signin');
>>>>>>> Stashed changes
    } else {
      // Create a JWT token for the user
     
      const token = generateAccessToken({
        role: user.role,
        id: user._id,
      });
      const refreshToken = generateRefreshToken(user);
      // Set the JWT token as a cookie and redirect to a protected page
<<<<<<< Updated upstream
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      console.log("Đăng nhập thành công");
=======
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      req.flash('message', 'Đăng nhập thành công');
      console.log('Đăng nhập thành công');
>>>>>>> Stashed changes
      const { password, ...others } = user._doc;
      res.status(200).json({ others, token, message: "Đăng nhập thành công" });
    }
  } catch (error) {
    console.log(error);
  }
};

// viết api logout để client gọi đến
const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Đăng xuất thành công' });
};

module.exports = {
  signIn,
  loginUser,
  logout,
};
