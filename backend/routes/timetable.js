const express = require('express');
const router = express.Router();
const position_Controller = require('../controllers/timetable.js');
router.post('/timtable', position_Controller.create);
module.exports = router;