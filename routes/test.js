const express = require('express');

const router = express.Router();
const testController = require('../controllers/test');

// user or user.html deu match route
router.get('/user(.html)?', testController.test);
module.exports = router;
