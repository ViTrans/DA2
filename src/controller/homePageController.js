const Post = require("../models/posts");
const showHomePage = async (req, res) => {
  const postsNew = await Post.find().sort({ createdAt: 1 }).limit(5);
  res.render("index", { title: "Trang Chủ", postsNew });
};

const getPosts = async (req, res) => {
  try {
    // lấy ra tất cả bài viết vào sort theo vip 3 trở xuống và thời gian
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;
    const totalPost = await Post.countDocuments();
    const totalPage = Math.ceil(totalPost / limit);
    const post = await Post.find({
      $or: [{ isvip: { $gte: 3 } }, { isvip: { $exists: false } }],
    })
      .sort({ isvip: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      post,
      totalPage,
      currentPage: page,
      hasNextPage: page < totalPage,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  showHomePage,
  getPosts,
};
