const express = require('express');
const router = express.Router(); 

const logincontrol=require('../controllers/login');
console.log('im authenticatiing from db');
router.post("/",logincontrol.a);

module.exports = router;