const express = require('express');
const passport = require('passport');
const fs=require('fs');
const csv=require('csvtojson');
const router = express.Router();
var multer=require('multer');
const upload=(multer({dest: 'uploads/'}));
router.get('/',passport.checkAuthentication,(req,res)=>{
    console.log("enter admin login")
    res.redirect('/login');
  });
router.use('/login',require('./users'));
const faculty=require('../controllers/faculty');
const student=require('../controllers/student');
router.post("/upload_faculty",passport.checkAuthentication,upload.single('fileSelect'),
   
})
router.post("/create_faculty",passport.checkAuthentication,faculty.a);
router.post("/create_student",passport.checkAuthentication,student.a);
router.use('/attendance',passport.checkAuthentication,require('./attendance'));
module.exports=router;