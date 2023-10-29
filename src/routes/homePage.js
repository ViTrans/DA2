const express = require('express');
const homePageController = require('../controller/homePageController');
const router = express.Router();

router.get('/', homePageController.getPosts);
router.get('/category/:category_id', homePageController.getPostByCategory);
module.exports = router;
