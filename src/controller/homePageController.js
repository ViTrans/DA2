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
<<<<<<< HEAD
const showPostDetails = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('postDetails', { title: 'Chi Tiết', post });
};
=======
>>>>>>> 653f1c03a2202d662d6ff476e91f2e3da1d3e99c

module.exports = {
  showHomePage,
};
