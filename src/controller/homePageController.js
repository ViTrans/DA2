// controller
const Post = require('../models/posts');
const showHomePage = async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('index', { title: 'Trang Chủ', posts });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  showHomePage,
};
