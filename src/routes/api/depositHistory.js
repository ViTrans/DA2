// lich sử nap tiền

const { Router } = require('express');
const router = Router();
const Payment = require('../../models/payment');
const { verifyToken, isAdmin } = require('../../middlewares/middlewaresController');
// get all
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req?.query;
    const skip = (page - 1) * limit;
    const payments = await Payment.find({ user_id: req.user.id })
      .populate([
        {
          path: 'user_id',
          select: '_id username',
        },
        {
          path: 'package_id',
          select: '_id name',
        },
      ])
      .sort({
        createAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const paymentNew = payments.map((item) => {
      return {
        ...item,
        name: item.package_id?.name,
        username: item.user_id.username,
      };
    });

    const totalRows = await Payment.find({ user_id: req.user.id }).countDocuments();

    const totalPages = Math.ceil(totalRows / limit);

    res.status(200).json({
      data: paymentNew,
      pagination: {
        totalRows,
        totalPages,
        page: +page,
        limit: +limit,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
