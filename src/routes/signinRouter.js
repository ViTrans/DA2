const express = require("express");
const router = express.Router();
const signinController = require("../controller/signinController");
const homePageController = require("../controller/homePageController");
router.get("/signin", signinController.signIn);
router.post("/signin", signinController.checkUser);
router.post("/logout", signinController.logout);
module.exports = router;
