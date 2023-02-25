// controller
const Post = require("../models/posts");
const showHomePage = async (req, res) => {
  const posts = await Post.find();
  res.render("index", { title: "Trang Chủ", posts });
};
const showPostDetails = async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("postDetails", { title: "Chi Tiết", post });
};
module.exports = {
  showHomePage,
  showPostDetails,
};