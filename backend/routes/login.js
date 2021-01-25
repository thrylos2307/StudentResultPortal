const express = require('express');
const router = express.Router();
const position_Controller = require('../controllers/login.js');
router.post('/welcome', position_Controller.create);
module.exports = router;