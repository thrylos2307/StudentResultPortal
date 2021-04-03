const express = require('express');
const router = express.Router();
const stage2_Controller = require('../controllers/stage2_verify_controller');
const authenticated = require('../config/authenticated');

router.post('/stage2', authenticated.checkLoggedIn, authenticated.stage2_1, stage2_Controller.verify);
// router.use('/stage3', require('./otp'));
// router.get('/stage4', stage4_Controller.verify);
module.exports = router;