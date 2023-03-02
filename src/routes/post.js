const express = require('express');
const router = express.Router();

const contronllers = require('../controller/post');
const fileUploader = require('../middlewares/cloudinary');
// fileUploader.array('file')
router.get('/', contronllers.list);
router.get('/create', contronllers.newForm);
// new post
router.post('/', fileUploader.array('file'), contronllers.createPost);

module.exports = router;
