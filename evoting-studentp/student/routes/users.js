const express=require('express');
const router=express.Router();
const passport = require('passport');
//console.log("enter the user router after /login ;");
const usersController=require('../controllers/users_controller');
router.get('/',usersController.signIn);
//console.log('i have seen the login route');
router.post('/create-session',passport.authenticate(
    'local',
    {   
        failureRedirect:'/login'
    },
) ,usersController.createSession);


module.exports=router;