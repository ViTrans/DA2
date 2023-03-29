const Category = require("../models/category");
const Post = require("../models/posts");
const User = require("../models/user");

const createPost = async (req, res, next) => {
  try {
    const path = req.files.map((link) => link.path);

    const data = {
      title: req.body.title,
      address: req.body.address,
      description: req.body.description,
      price: req.body.price,
      images: path,
      phone: req.body.phone,
      category_id: req.body.category,
      acreage: req.body.acreage,
      user_id: req.session.user._id,
    };

    const post = await Post.create(data);
    // add post to user
    const user = await User.findById(req.session.user._id);
    user.posts.push(post._id);
    await user.save();

    console.log(req.body);
    res.redirect("/");
  } catch (error) {
    console.log("lỗ tại create post", error);
  }
};

// list
const list = async (req, res, next) => {
  res.render("./admin/posts/index", { title: "Post" });
};

const addEdit = async (req, res, next) => {
  res.render("./admin/posts/add-edit", { title: "Add-edit Page" });
};

module.exports = { addEdit, list, createPost };
