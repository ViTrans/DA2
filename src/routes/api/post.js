const { Router } = require('express');
const router = Router();
const Post = require('../../models/posts');
const User = require('../../models/user');
const fileUploader = require('../../middlewares/cloudinary');

// get all
router.get('/currentUser/', async (req, res) => {
  // let searchOptions = {};

  const { page = 1, limit = 4 } = req?.query;
  const skip = (page - 1) * limit;

  // if (req.query.title != null && req.query.title !== '') {
  //   searchOptions.title = new RegExp(req.query.title, 'i');
  // }
  // if (req.query.category != null && req.query.category !== '') {
  //   console.log(typeof req.query.category);
  //   console.log(req.query.category);
  //   searchOptions.category = req.query.category;
  //   searchOptions.categoryId = searchOptions.category;
  // }
  try {
    console.log(req.session);
    const userId = req?.session?.user?._id;

    if (!userId) return res.status(401);

    const posts = await Post.find({ user_id: userId }, { rawResult: false })
      .populate({
        path: 'user_id',
        select: '_id',
      })
      .sort({
        createAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(posts);

    const totalRows = await Post.countDocuments();

    const totalPages = Math.ceil(totalRows / limit);

    res.status(200).json({
      data: posts,
      pagination: {
        totalRows,
        totalPages,
        page: +page,
        limit: +limit,
      },
    });
  } catch (error) {
    res.status(500);
  }
});

// get by id
// router.get('/:id', (req, res) => {
//   res.json({
//     message: 'get by id',
//   });
// });

// create
router.post('/', fileUploader.array('file'), async (req, res) => {
  try {
    console.log(req.file)
    console.log(req.files);
    const path = req.files.map((link) => link.path);
    const filenameArr = req.files.map((link) => link.filename);

    const data = {
      title: req.body.title,
      address: req.body.address,
      description: req.body.description,
      price: parseInt(req.body.price),
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
    await user.save();
    console.log('gooooooo');
    res.status(201).json({
      code: 201,
      data: post,
    });
  } catch (error) {
    console.log('create error post', error);
    if (req?.file) {
      req?.file.forEach(async (f) => {
        await cloudinary.uploader.destroy(f?.filename, (err, result) => {
          if (err) return res.status(500);
          console.log('đã xóa file cũ khi up ảnh mới', res);
          console.log('delete image cloudinary');
        });
      });
    }
    res.status(500);
  }
});

module.exports = router;
