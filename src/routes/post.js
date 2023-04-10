const express = require('express');
const router = express.Router();

const contronllers = require('../controller/post');

router.get('/', contronllers.list);
router.get('/all', contronllers.listAll);
router.get('/add-edit', contronllers.addEdit);

module.exports = router;
