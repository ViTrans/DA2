const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../../middlewares/middlewaresController');
const { create, getAll, getbyId, update } = require('../../controller/ajax/package');

router.post('/', verifyToken, create);
router.get('/', verifyToken, getAll);

router.get('/:id', verifyToken, getbyId);
router.put('/:id', verifyToken, update);
module.exports = router;
