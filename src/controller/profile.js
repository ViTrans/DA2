const User = require('../models/user');

const formEdit = (req, res) => {
  const user = User.findOne({ _id: req.user._id });
  res.render('./admin/profile/index', { title: 'profile', error: '', message: '' });
};
const update = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    if (!user)
      return res.render('profile', { title: 'profile', error: 'User không tồn tại', message: '' });
    user.name = name;
    user.email = email;
    await user.save();
    return res.render('profile', { title: 'profile', error: '', message: 'Cập nhật thành công' });
  } catch (error) {
    res.render('profile', { title: 'profile', error: 'Có lỗi xảy ra', message: '' });
  }
};
module.exports = { formEdit, update };
