const Post = require("../models/posts");
const showPostDetails = async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user_id");
  const postsNew = await Post.find().sort({ createdAt: 1 }).limit(4);
  console.log(post.user_id);
  res.render("postDetails", { title: "Chi Tiết", post, postsNew });
};

module.exports = {
  showPostDetails,
};
