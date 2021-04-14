const express = require('express');
const passport = require('passport');
const router = express.Router();
const position_Controller = require('../controllers/academic.js');
const type = require('../controllers/type');
router.get('/deltable',passport.checkAuthentication, (req, res, next) => {
    type.user(req, res, 'faculty_login', next);
  },position_Controller.deltable);
router.post('/createtable',passport.checkAuthentication, position_Controller.create);
router.post('/updatetable',passport.checkAuthentication, position_Controller.update);
router.post('/showtables',passport.checkAuthentication, position_Controller.show);
router.get('/showtables',passport.checkAuthentication, (req, res, next) => {
    type.user(req, res, 'faculty_login', next);
  },position_Controller.show);
router.get('/results',passport.checkAuthentication,(req, res, next) => {
    type.user(req, res, 'faculty_login', next);
  }, position_Controller.result);
router.post('/update',passport.checkAuthentication, position_Controller.resupdate);
router.get('/delete',(req, res, next) => {
    type.user(req, res, 'faculty_login', next);
  },passport.checkAuthentication, position_Controller.delete);
router.post('/addresult',passport.checkAuthentication, position_Controller.addresult);
module.exports = router;