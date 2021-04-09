const express = require('express');
const router = express.Router();
const authenticated = require('../config/authenticated');
const create_user_Controller = require('../controllers/create_user_controller');
const result_Controller = require('../controllers/result_Controller');
var multer = require('multer');
const upload = (multer({ dest: 'uploads/' }));
router.get('/', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
    res.redirect('/home');
});
router.get('/home', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
    return req.user.isVoter ? res.render('voter_home') : res.redirect('/admin');
});
router.get('/failed', (req, res) => {
    return res.status(401).json({
        status: 'failed'
    });
});
router.use('/verify', require('./verify'));
router.use('/users', require('./user'));
router.get('/verify_otp', authenticated.checkAdminLoggedIn, (req, res) => {return res.render('verify_otp');});
router.get('/new_pass', authenticated.checkAdminLoggedIn, (req, res) => {return res.render('new_pass');})
router.post('/create', authenticated.checkAdminLoggedIn, authenticated.stage2,  create_user_Controller.create);
router.post('/upload', authenticated.checkAdminLoggedIn, authenticated.stage2, upload.single('file'), create_user_Controller.upload);
router.use('/admin', require('./admin'));
router.use('/vote', require('./vote'));
router.get('/result', authenticated.checkLoggedIn, authenticated.stage2, result_Controller);
// router.get('/result',  authenticated.checkLoggedIn, authenticated.stage2 , result_Controller);
module.exports = router;