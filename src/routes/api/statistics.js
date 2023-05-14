const express = require('express');
const { verifyToken } = require('../../middlewares/middlewaresController');
const User = require('../../models/user');
const Post = require('../../models/posts');
const Package = require('../../models/package');
const categories = require('../../models/category');

const router = express.Router();

// viết api thống kê số lượng người dùng , số lượng bài viết , số lượng gói ,
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.find();
    const countUser = user.length;
    const post = await Post.find();
    const countPost = post.length;
    const package = await Package.find();
    const countPackage = package.length;
    const category = await categories.find();
    const countCategory = category.length;
    res.status(200).json({ countUser, countPost, countPackage, countCategory });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
