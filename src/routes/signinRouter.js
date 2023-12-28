const express = require('express');
const router = express.Router();
const signinController = require('../controller/signinController');
router.get('/', signinController.signIn);
router.post('/', signinController.loginUser);
router.get('/logout', signinController.logout);
module.exports = router;
