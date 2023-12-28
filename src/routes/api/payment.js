const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/middlewaresController');
const { create } = require('../../controller/ajax/payment');

router.post('/createPayment', verifyToken, create);

module.exports = router;
