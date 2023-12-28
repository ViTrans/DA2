const express = require('express');
const { verifyToken } = require('../../middlewares/middlewaresController');
const { uploadCloud } = require('../../middlewares/cloudinary');
const { getbyId, update, changePassword } = require('../../controller/ajax/profile');

const router = express.Router();
router.get('/', verifyToken, getbyId);

// update profile
router.put('/', verifyToken, uploadCloud.single('file'), update);

router.put('/change-password', verifyToken, changePassword);

module.exports = router;
