
const express = require('express');
const passport = require('passport');
const fs = require('fs');

const router = express.Router();
var multer = require('multer');
const upload = (multer({ dest: 'uploads/' }));
router.get('/', passport.checkAuthentication, (req, res) => {
  console.log("enter admin login")
  res.redirect('/login');
});
router.use('/login', require('./users'));
router.use('/faculty', require('./academic'));
router.use('/admin', require('./showtable'));
const faculty = require('../controllers/faculty');
const student = require('../controllers/student');
const major = require('../controllers/major');
const type = require('../controllers/type');
const result = require('../controllers/result');

const log = require('../controllers/login');
const { render } = require('ejs');
const { route } = require('./users');
router.post("/showresult", passport.checkAuthentication, result.a);
router.post("/upload_faculty", passport.checkAuthentication, upload.single('fileSelect'), faculty.b);
router.post("/f_upload_student", passport.checkAuthentication, upload.single('fileSelect'), faculty.c);
router.post("/upload_student", passport.checkAuthentication, upload.single('fileSelect'), student.b);
router.post("/upload_major", passport.checkAuthentication, upload.single('fileSelect'), major.b);
router.all("/file_uploaded", (req, res) => {
  console.log(req.file);
  console.log(res.file);
  res.redirect("/login");
});

router.get('/logout', passport.checkAuthentication, (req, res) => {
  req.logout();
  req.session.uid = undefined;
  req.session.user_position = undefined;
  req.flash("success", "successfully logout!!");
  res.locals.message=req.flash("success");
  res.render('login.ejs');

});


router.get('/forgot_password', function (request, response) {
  response.render('./forgot_password.ejs');
});
router.post("/create_faculty", passport.checkAuthentication, (req, res, next) => {
  type.user(req, res, 'Admin', next);
}, faculty.a);
router.post('/cgpwd', log.cgpwd);
router.post('/forgot_password/email', log.forgot);
router.get('/changepassword', passport.checkAuthentication, (req, res) => {
  res.render('changp.ejs')
});
router.get('/otp',(res,req)=>{
  req.render("new_f_password.ejs");
})
router.get('/passchange', (res,req)=>{
  req.render('login.ejs');
});
router.post('/forgot_password/otp', log.otp);
router.post('/forgot_password/cp', log.cp);
router.post("/create_student", passport.checkAuthentication,(req, res, next) => {
  type.user(req, res, 'Admin', next);
}, student.a);
router.post("/create_major", passport.checkAuthentication,(req, res, next) => {
  type.user(req, res, 'Admin', next);
}, major.a);

router.get('/*',(req,res)=>{
  res.render("pagenotfound.ejs");
});
module.exports = router;