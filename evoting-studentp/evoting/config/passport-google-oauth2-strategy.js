var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const env = require('./environment');
const User = require('../models/user');
const express = require('express');
var session = require('express-session')

passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
  },
  function(accessToken, refreshToken, profile, done) {
       User.findOne({email: profile._json.email}, function (err, user) {
            if(err){console.log('error in google strategy-passport', err); return;}

            return done(err, user);
       });
  }
));


passport.serializeUser(function(user, done) {
     done(null, user);
});

passport.deserializeUser(function(user, done) {
     done(null, user);
 });
module.exports=passport;