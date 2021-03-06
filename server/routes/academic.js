const express = require('express');
const router = express.Router();
const position_Controller = require('../controllers/academic.js');
router.post('/results', position_Controller.create);
module.exports = router;