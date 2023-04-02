const express = require("express");
const homePageController = require("../controller/homePageController");
const router = express.Router();

router.get("/", homePageController.showHomePage);
router.get("/category/:category_id", homePageController.getPostsByCategory);

module.exports = router;
