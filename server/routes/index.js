const express = require('express');
const passport = require('passport');
const fs=require('fs');

const router = express.Router();
var multer=require('multer');
const upload=(multer({dest: 'uploads/'}));
router.get('/',passport.checkAuthentication,(req,res)=>{
    console.log("enter admin login")
    res.redirect('/login');
  });
router.use('/login',require('./users'));
router.use('/faculty',require('./academic'));
const faculty=require('../controllers/faculty');
const student=require('../controllers/student');
const major=require('../controllers/major');
const type=require('../controllers/type');
router.post("/upload_faculty",passport.checkAuthentication,upload.single('fileSelect'),faculty.b);
router.post("/upload_student",passport.checkAuthentication,upload.single('fileSelect'),student.b);
router.post("/upload_major",passport.checkAuthentication,upload.single('fileSelect'),major.b);
router.all("/file_uploaded",(req,res)=>{
   console.log(req.file);
   console.log(res.file);
   res.redirect("/login");
});
router.post("/create_faculty",passport.checkAuthentication,(req,res,next)=>{
  type.user(req,res,'Admin',next);
},faculty.a);
router.post("/create_student",passport.checkAuthentication,student.a);
router.post("/create_major",passport.checkAuthentication,major.a);
router.use('/attendance',passport.checkAuthentication,require('./attendance'));
module.exports=router;