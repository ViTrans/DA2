const { Router } = require('express');
const router = Router();

const { verifyToken, isAdmin } = require('../../middlewares/middlewaresController');

const { uploadCloud, cloudinary } = require('../../middlewares/cloudinary');
const {
  curent,
  getAll,
  getbyId,
  suggest,
  create,
  update,
  delPost,
} = require('../../controller/ajax/post');
// get all
router.get('/currentUser/', verifyToken, curent);

// admin
// get all
router.get('/getAll/', verifyToken, isAdmin, getAll);
// admin

router.get('/:id', verifyToken, getbyId);
router.post('/suggest', suggest);

// create
router.post('/', verifyToken, uploadCloud.array('file'), create);

router.put('/:id', verifyToken, uploadCloud.array('file'), update);

// remove post
router.delete('/:id', verifyToken, delPost);
module.exports = router;

// province=Tỉnh+Tuyên+Quang&district=Huyện+Hàm+Yên&minPrice=200000&maxPrice=300000&minAcreage=70&maxAcreage=90
