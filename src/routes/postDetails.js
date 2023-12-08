const express = require('express');
const router = express.Router();
const postDetails = require('../controller/postDetailsController');
router.get('/:id', postDetails.showPostDetails);
module.exports = router;
