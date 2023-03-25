const express = require("express");
const homePageController = require("../controller/homePageController");
const router = express.Router();

router.get("/", homePageController.showHomePage);
router.get("/getPosts", homePageController.getPosts);

module.exports = router;
