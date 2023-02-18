const express = require('express');

const router = express.Router();
const testController = require('../controllers/test');

router.get('/user(.html)?', testController.test);
module.exports = router;
