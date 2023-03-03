const express = require('express');
const homePageController = require('../controller/homePageController');
const router = express.Router();

router.get('/', homePageController.showHomePage);
router.get('/details/:id', homePageController.showPostDetails);
module.exports = router;
