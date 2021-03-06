const express = require('express');
const passport = require('passport');
const router = express.Router();
router.get('/',passport.checkAuthentication,(req,res)=>{
    console.log("enter admin login")
    res.redirect('/login');
  });
router.use('/login',require('./users'));
const faculty=require('../controllers/faculty');
const student=require('../controllers/student');
router.post("/create_faculty",passport.checkAuthentication,faculty.a);
router.post("/create_student",passport.checkAuthentication,student.a);
router.use('/attendance',passport.checkAuthentication,require('./attendance'));
module.exports=router;