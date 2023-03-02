const express = require('express');
const router = express.Router();
const controller = require('../controller/category');

router.get('/', controller.list);
router.get('/create', controller.newForm);
// new category
router.post('/', controller.createCaregory);

module.exports = router;
