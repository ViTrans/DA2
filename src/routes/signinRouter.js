const express = require('express');
const router = express.Router();
const signinController = require('../controller/signinController');
router.get('/signin', signinController.signIn);
router.post('/signin', signinController.checkUser);
module.exports = router;
