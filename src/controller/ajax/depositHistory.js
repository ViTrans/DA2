// lich sử nap tiền

const Payment = require('../../models/payment');
// get all
const getAll = async (req, res) => {
  try {
    const payments = await Payment.find({ user_id: req.user.id })
      .sort({
        created_at: -1,
      })
      .populate([
        {
          path: 'user_id',
          select: '_id username',
        },
        {
          path: 'package_id',
          select: '_id name price',
        },
      ])
      .lean();

    const paymentNew = payments.map((item) => {
      return {
        ...item,
        name: item.package_id?.name,
        price: item.package_id?.price,
        username: item.user_id.username,
      };
    });

    res.status(200).json({
      data: paymentNew,
    });
  } catch (error) {
    res.status(500);
  }
};

module.exports = { getAll };
