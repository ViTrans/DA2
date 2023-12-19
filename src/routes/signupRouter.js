const express = require('express');
const router = express.Router();
const signupController = require('../controller/signupController');
router.get('/', signupController.signUp);
router.post('/', signupController.register);
module.exports = router;
