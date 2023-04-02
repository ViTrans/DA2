<<<<<<< Updated upstream
const Category = require('../models/category');
const Post = require('../models/posts');
const User = require('../models/user');

const createPost = async (req, res, next) => {
  try {
    const path = req.files.map((link) => link.path);
    const filenameArr = req.files.map((link) => link.filename);

    const data = {
      title: req.body.title,
      address: req.body.address,
      description: req.body.description,
      price: req.body.price,
      images: path,
      filenameList: filenameArr,
      phone: req.body.phone,
      category_id: req.body.category,
      acreage: req.body.acreage,
      user_id: req.session.user._id,
    };
    const post = await Post.create(data);
    const user = await User.findById(req.session.user._id);
    user.posts.push(post._id);
    console.log('gooooooo')
    await user.save();
    res.status(201).json({
      code: 201,
      data: post,
    });
  } catch (error) {
    console.log('lỗ tại create post', error);
  }
};

=======
>>>>>>> Stashed changes
// list
const list = async (req, res, next) => {
  res.render('./admin/posts/index', { title: 'Post' });
};

const addEdit = async (req, res, next) => {
  res.render('./admin/posts/add-edit', { title: 'Add-edit Post' });
};

module.exports = { addEdit, list };
