const express = require('express');
const router = express.Router();
const passport = require('passport');
const user = require('../models/user');
const f_user = require('../models/forget_p_token');
const bcrypt = require('bcrypt');
const authenticated = require('../config/authenticated');
const transporter = require('../config/nodemailer').transporter;
const saltRounds = 10;
router.get('/logout', (req, res) => {
  req.logout();
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
  const oPass = req.body.old_pass;
  const nPass = req.body.new_pass;
  console.log(req.user);
  const cnPass = req.body.confirm_new_pass;
  const pMatch = await bcrypt.compare(oPass, req.user.password);
  if (nPass !== cnPass) {
    console.log('not matching')
    return res.render('change_pass');
  } if (!pMatch) {
    console.log('password mismatch');
    return res.render('change_pass');
  }
  var hash = await bcrypt.hashSync(nPass, saltRounds);
  user.updateOne({ _id: req.user._id }, { password: hash }, (err, data) => {
    if (err) { return res.render('change_pass'); }
  });
  return res.redirect('/home');
});

router.get('/forget_password', authenticated.checkLoggedIn, async (req, res) => {
  return res.render('input_id');
});

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
  console.log(req.user.uid, req.body.uid);
  if (req.user.uid == req.body.uid) {
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
          return res.redirect('/users/forget_password');
        } else {
          console.log('Email sent: ' + info.response);
          return res.render('verify_otp');
        }
      });
    }
    });
  }
});
router.post('/f_p/otp_verify', authenticated.checkLoggedIn, (req, res) => {
  f_user.findOne({userId : req.user._id}, async (err, data) => {
    const token_match = await bcrypt.compare(req.body.otp, data.token);
      if(token_match) {
        await f_user.deleteOne({userId : req.user._id});
        return res.render('new_pass');
      }else{
        res.redirect('/users/forget_password');
      }
    });
});

router.post('/f_p/change_pass',authenticated.checkLoggedIn,  async (req, res) => {
  const new_pass = req.body.new_pass;
  const conf_pass = req.body.confirm_pass;
  console.log(new_pass);
  if(new_pass === conf_pass) {
    const encrp_pass = await bcrypt.hashSync(new_pass, saltRounds);
    await user.findByIdAndUpdate(req.user._id, {password : encrp_pass}, (err, done) => {
      if(err) {
        console.log('unable to change password');
        return res.render('new_pass');
      } else {
        console.log('password change done');
        return res.render('stage2');
      }
    });
  }else{
    console.log('both pass do not match');
    return res.render('new_pass');
  }
});
module.exports = router;