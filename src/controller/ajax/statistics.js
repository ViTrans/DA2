const User = require('../../models/user');
const Post = require('../../models/posts');
const categories = require('../../models/category');

// viết api thống kê số lượng người dùng , số lượng bài viết , số lượng gói ,
const getAll = async (req, res) => {
  try {
    const user = await User.find();
    const countUser = user.length;
    const post = await Post.find();
    const countPost = post.length;
    const category = await categories.find();
    const countCategory = category.length;
    // tổng số bài viết có isVip bằng string vip1

    const vip1 = await Post.find({ isvip: 'vip1' });
    const countVip1 = vip1.length;
    const vip2 = await Post.find({ isvip: 'vip2' });
    const countVip2 = vip2.length;
    const vip3 = await Post.find({ isvip: 'vip3' });
    const countVip3 = vip3.length;

    res.status(200).json({ countUser, countPost, countCategory, countVip1, countVip2, countVip3 });
  } catch (error) {
    res.status(500);
  }
};

module.exports = { getAll };
