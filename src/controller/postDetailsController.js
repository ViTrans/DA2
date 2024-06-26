const Post = require('../models/posts');
const showPostDetails = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user_id').populate('category_id');
  res.render('postDetails', { title: 'Chi Tiết', post });
};
module.exports = {
  showPostDetails,
};
