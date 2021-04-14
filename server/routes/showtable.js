const express = require('express');
const passport = require('passport');
const router = express.Router();
const table=require('../controllers/table')
router.get("/showtables",passport.checkAuthentication,table.show);
router.get("/delete",passport.checkAuthentication,table.delete);
router.get("/update",passport.checkAuthentication,table.update);
module.exports = router;