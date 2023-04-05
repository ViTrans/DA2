const { Router } = require('express');
const router = Router();
const Category = require('../../models/category');
const { verifyToken, isAdmin } = require('../../middlewares/middlewaresController');
// get all categories
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500);
  }
});

// get  category by id
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
  const id = req.params.id;
  const posts = await Post.findById(id);
  res.status(200).json(posts);
});

module.exports = router;
