const Post = require("../models/posts");

const ITEMS_PER_PAGE = 4;

const getPaginatedPosts = async (query, currentPage = 1) => {
  const page = parseInt(currentPage) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const totalPost = await Post.countDocuments(query);
  const totalPage = Math.ceil(totalPost / ITEMS_PER_PAGE);
  const posts = await Post.find(query)
    .sort({ isvip: -1, createdAt: -1 })
    .skip(skip)
    .limit(ITEMS_PER_PAGE)
    .populate("category_id");

  return {
    posts,
    totalPage,
    currentPage,
    totalPost,
    itemsPerPage: ITEMS_PER_PAGE,
    category_id: query.category_id,
    page,
  };
};

const showHomePage = async (req, res) => {
  const postsNew = await Post.find().sort({ createdAt: 1 }).limit(5);
  const page = parseInt(req.query.page) || 1;
  const query = {
    $or: [{ isvip: { $gte: 3 } }, { isvip: { $exists: false } }],
  };

  const { posts, ...pagination } = await getPaginatedPosts(query, page);

  res.render("index", {
    title: "Trang Chủ",
    postsNew,
    posts,
    ...pagination,
  });
};

const getPostsByCategory = async (req, res) => {
  const postsNew = await Post.find().sort({ createdAt: 1 }).limit(5);
  const page = parseInt(req.query.page) || 1;
  const categoryId = req.params.category_id;
  const query = { category_id: categoryId };

  const { posts, ...pagination } = await getPaginatedPosts(query, page);

  res.render("index", {
    title: "Trang Chủ",
    posts,
    ...pagination,
    postsNew,
  });
};

module.exports = {
  showHomePage,
  getPostsByCategory,
};
