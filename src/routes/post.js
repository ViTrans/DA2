const express = require("express");
const router = express.Router();

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

module.exports = router;
