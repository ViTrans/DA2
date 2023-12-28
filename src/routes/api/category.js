const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../../middlewares/middlewaresController');
const { getAll, getbyId, delCate, create, update } = require('../../controller/ajax/category');
// get all categories
router.get('/', getAll);

// get  category by id
router.get('/:id', verifyToken, getbyId);

router.delete('/:id', verifyToken, delCate);

// add

router.post('/', verifyToken, create);

// updated

router.put('/:id', verifyToken, update);
module.exports = router;
  