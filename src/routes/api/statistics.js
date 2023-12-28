const express = require('express');
const { verifyToken } = require('../../middlewares/middlewaresController');
const { getAll } = require('../../controller/ajax/statistics');

const router = express.Router();

// viết api thống kê số lượng người dùng , số lượng bài viết , số lượng gói ,
router.get('/', verifyToken, getAll);

module.exports = router;
