const Post = require('../models/posts');
const getPostNew = async (req, res, next) => {
  const postsNew = await Post.find().sort({ createdAt: -1 }).limit(5);
  res.locals.postsNew = postsNew;
  console.log('get post new');
  next();
};
module.exports = getPostNew;
  