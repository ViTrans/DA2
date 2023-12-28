// lich sử nap tiền

const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../../middlewares/middlewaresController');
const { getAll } = require('../../controller/ajax/depositHistory');
// get all
router.get('/', verifyToken, getAll);

module.exports = router;
