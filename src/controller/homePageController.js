// controller
const Post = require("../models/posts");
const showHomePage = async (req, res) => {
  const posts = await Post.find();
  res.render("index", { title: "Trang Chủ", posts });
};

module.exports = {
  showHomePage,
};
