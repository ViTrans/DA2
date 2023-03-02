const express = require('express');
const router = express.Router();

const contronllers = require('../controller/post');
const fileUploader = require('../middlewares/cloudinary');
// fileUploader.array('file')
router.get('/', contronllers.list);
router.get('/create', contronllers.newForm);
// new post
router.post('/', fileUploader.array('file'), contronllers.createPost);
router.get('/posts', (req, res) => {
  res.render('post', { title: ' Post' });
});
router.get('/posts/create', (req, res, next) => {
  res.render('create-post', { title: 'Create Post' });
});
// new post
router.post('/', (req, res) => {
  console.log(req.body);
});

module.exports = router;
