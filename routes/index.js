const express = require('express');
const router = express.Router();
const authenticated = require('../config/authenticated');
const create_user_Controller = require('../controllers/create_user_controller');
const result_Controller = require('../controllers/result_Controller');
var multer = require('multer');
const upload = (multer({ dest: 'uploads/' }));
const transporter = require('../config/nodemailer').transporter;
var handlebars = require('handlebars');
var fs = require('fs');
// router.get('/', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
//     res.redirect('/home');
// });
router.get('/', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
    // req.flash('success', 'logged in')
    return req.user.isVoter ? res.render('voter_home') : res.redirect('/admin');
});
router.get('/contact', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
    res.render('suggestions')
});
router.post('/suggestions', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
    const data = req.body;
    const message = data.message.trim();
    const subject = data.subject.trim();
    if (message && subject && message.length > 0 && subject.length > 0) {
        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    throw err;
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };
        readHTMLFile(__dirname + '/../views/emailWithPDF.html', async function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                subject: subject,
                message: message,
                name: req.user.name
            };
            console.log(replacements)
            var htmlToSend = template(replacements);

            var mailOptions = {
                from: req.user.email,
                to: 'puneetverma951761@gmail.com',
                subject: subject,
                html: htmlToSend
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    req.flash('error', 'Unable to sent message');
                    return res.redirect('back');
                } else {
                    req.flash('success', 'Message has been delivered');
                    console.log('Email sent: ' + info.response);
                    return res.redirect('/');
                }
            });
        })
    }
})
router.get('/failed', (req, res) => {
    return res.status(401).json({
        status: 'failed'
    });
});
router.get('/about', (req, res) => {
    return res.render('about')
})
router.use('/verify', require('./verify'));
router.use('/users', require('./user'));
router.get('/verify_otp', authenticated.checkLoggedIn, (req, res) => { return res.render('verify_otp'); });
router.get('/new_pass', authenticated.checkLoggedIn, (req, res) => { return res.render('new_pass'); })
router.post('/create', authenticated.checkAdminLoggedIn, authenticated.stage2, create_user_Controller.create);
router.post('/upload', authenticated.checkAdminLoggedIn, authenticated.stage2, upload.single('file'), create_user_Controller.upload);
router.use('/admin', require('./admin'));
router.use('/vote', require('./vote'));
router.get('/result', authenticated.checkLoggedIn, authenticated.stage2, result_Controller);
router.get('*', function (req, res) {
    res.render('page_does_not_exist')
});
// router.get('/result',  authenticated.checkLoggedIn, authenticated.stage2 , result_Controller);
module.exports = router;