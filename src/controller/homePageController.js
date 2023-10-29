const Post = require('../models/posts');
const getPosts = async (req, res) => {
  const queries = { ...req.query };
  if (queries.address) {
    queries.address = { $regex: queries.address, $options: 'i' };
  }
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((el) => delete queries[el]);
  const queryStr = JSON.stringify(queries).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(queryStr);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const query = Post.find(JSON.parse(queryStr)).skip(skip).limit(limit).sort({
    isvip: -1,
  });
  // sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query.sort(sortBy);
  }
  // pagination
  const totalPost = await Post.countDocuments(JSON.parse(queryStr));
  const totalPage = Math.ceil(totalPost / limit);

  const posts = await query;
  res.render('index', {
    title: 'Trang Chủ',
    posts,
    totalPost,
    totalPage,
  });
};

const getPostByCategory = async (req, res) => {
  const categoryId = req.params.category_id;
  const query = { category_id: categoryId };
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;

  const posts = await Post.find(query)
    .sort({
      isvip: -1,
    })
    .skip(skip)
    .limit(limit);

  // pagination
  const totalPost = await Post.countDocuments(query);
  const totalPage = Math.ceil(totalPost / 4);

  console.log(totalPost);
  console.log(totalPage);

  res.render('index', {
    title: 'Trang Chủ',
    posts,
    totalPost,
    totalPage,
  });
};

const filterPosts = async (req, res) => {};

module.exports = {
  getPosts,
  getPostByCategory,
};
