const User = require('../../models/user');
// get all users
// router.get('/', verifyToken, async (req, res) => {
//   try {
//     const categories = await Category.find();

//     res.status(200).json({
//       categories,
//     });
//   } catch (error) {
//     res.status(500);
//   }
// });

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

const curent = async (req, res) => {
  try {
    const id = req?.user?.id;
    const user = await User.findById(id).select('username phone role');
    res.status(200).json({
      code: 200,
      user,
    });
  } catch (error) {}
};

module.exports = { curent };
