const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../../middlewares/middlewaresController');
const { curent } = require('../../controller/ajax/user');
// get all users
router.get('/', verifyToken, async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    res.status(500);
  }
});

// get  user by id
// router.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//
//     const user = await User.findById(id);
//     res.status(200).json({
//       code: 200,
//       data: user,
//     });
//   } catch (error) {
//
//   }
// });

router.get('/curent', verifyToken, curent);

module.exports = router;
