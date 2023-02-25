const express = require("express");
const router = express.Router();
const signupController = require("../controller/signupController");
router.get("/signup", signupController.signUp);
router.post("/signup", signupController.createUser);
module.exports = router;
