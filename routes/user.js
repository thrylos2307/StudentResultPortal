const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../models/user');
const f_user = require('../models/forget_p_token');
const bcrypt = require('bcrypt');
const authenticated = require('../config/authenticated');
const transporter = require('../config/nodemailer').transporter;
const saltRounds = 10;
const swal = require('sweetalert');
router.get('/logout', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
  req.logout();
  req.flash('success','Successfully logged out');
  req.session.uid = undefined;
  req.session.user_position = undefined;
  res.redirect('/');
});
router.get('/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), (req, res) => {
  res.render('stage2');
});
router.get('/change_pass', authenticated.checkLoggedIn, authenticated.stage2, (req, res) => {
  return res.render('change_pass');
});
router.post('/update_pass', authenticated.checkLoggedIn, authenticated.stage2, async (req, res) => {
  const oPass = req.body.old_pass.trim();
  const nPass = req.body.new_pass.trim();
  if(oPass.length < 8 || nPass.length < 8){
    
    return res.redirect('/home');
  }
  const cnPass = req.body.confirm_new_pass.trim();
 
  if (nPass !== cnPass) {
    req.flash('error','Password and confirm password does not match!');
    console.log('not matching')
    return res.redirect('/users/change_pass');
  }
  const User = await user.findOne({email : req.user.email});
  console.log(User);
  const pMatch = await bcrypt.compare(oPass, User.password);
  if (!pMatch) {
    req.flash('error','Incorrect password!');
    console.log('password mismatch');
    return res.redirect('/users/change_pass');
  }
  var hash = await bcrypt.hashSync(nPass, saltRounds);
  await user.updateOne({ _id: req.user._id }, { password: hash }, (err, data) => {
    if (err) { req.flash('error','Some error occured!'); return res.render('change_pass'); }
  });
  req.flash('success','Password updated successfully');
  return res.redirect('/home');
});

router.get('/forget_password', authenticated.checkLoggedIn, async (req, res) => {
  return res.render('input_id');
});
router.get('/create', authenticated.checkAdminLoggedIn, authenticated.stage2, (req, res) => {
  return res.render('create_user');
})
router.post('/forget_password', authenticated.checkLoggedIn, async (req, res) => {
  let done = false;
  await f_user.findOne({userId : req.user._id}, (err, data) => {
    if(data) {
      done = true;
    }
  });
  if(done){
    await f_user.deleteOne({userId : req.user._id});
  }
  if (req.body.uid && req.user.uid == req.body.uid) {
    const otp = Math.floor(Math.random() * 99999) + "";
    var mailOptions = {
      from: 'testcodeial@gmail.com',
      to: req.user.email,
      subject: 'OTP for password change for codeial will expire in 2 minutes',
      text: otp
    };
    var encry_token = await bcrypt.hashSync(otp, saltRounds);
    await f_user.create({userId : req.user._id, token : encry_token}, (err, data) => {
      if(err) {
        console.log('error in saving token in db', err);
        return res.render('input_id');
      }else{
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          f_user.findOneAndDelete({userId: req.user._id});
          req.flash('error','Unable to sent OTP');
          return res.redirect('/users/forget_password');
        } else {
          req.flash('success','OTP sent to your mail id');
          console.log('Email sent: ' + info.response);
          return res.redirect('/verify_otp');
        }
      });
    }
    });
  }
});
router.post('/f_p/otp_verify', authenticated.checkLoggedIn, (req, res) => {
 if(req.body.otp.trim().length < 1){
    req.flash('error','otp cannot be null!');
    return res.redirect('/verify_otp');
  } 
  f_user.findOne({userId : req.user._id}, async (err, data) => {
    const token_match = await bcrypt.compare(req.body.otp.trim(), data.token);
      if(token_match) {
        await f_user.deleteOne({userId : req.user._id});
        req.flash('success','otp matched');
        return res.redirect('/new_pass');
      }else{
        req.flash('error','otp mismatch');
        return res.redirect('/verify_otp');
      }
    });
});

router.post('/f_p/change_pass',authenticated.checkLoggedIn,  async (req, res) => {
  const new_pass = req.body.new_pass.trim();
  const conf_pass = req.body.confirm_pass.trim();
  if(new_pass.length < 8 || conf_pass.length < 8){
    return res.redirect('/new_pass');
  }
  if(new_pass === conf_pass) {
    const encrp_pass = await bcrypt.hashSync(new_pass, saltRounds);
    await user.findByIdAndUpdate(req.user._id, {password : encrp_pass}, (err, done) => {
      if(err) {
        req.flash('error','Unable to change password');
        console.log('unable to change password');
        return res.redirect('/new_pass');
      } else {
        req.flash('success','Password updated');
        console.log('password change done');
        return res.redirect('/verify/stage2');
      }
    });
  }else{
    req.flash('error','Password does not match');
    console.log('both pass do not match');
    return res.redirect('/new_pass');
  }
});
module.exports = router;