const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const contronllers = require('../controller/post');
const fileUploader = require('../middlewares/cloudinary');
// fileUploader.array('file')
router.get('/', contronllers.list);
router.get('/create', contronllers.newForm);
// new post
router.post('/', fileUploader.array('file'), contronllers.createPost);
=======
router.get("/posts", (req, res) => {
  res.render("post", { title: " Post" });
});
router.get("/posts/create", (req, res, next) => {
  res.render("create-post", { title: "Create Post" });
});
// new post
router.post("/", (req, res) => {
  console.log(req.body);
});
>>>>>>> 653f1c03a2202d662d6ff476e91f2e3da1d3e99c

module.exports = router;
