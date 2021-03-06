const express = require('express');
const router = express.Router();

const position_Controller = require('../controllers/attendance.js');
router.post('/read_attendace', position_Controller.create);
router.get('/read',(req,res)=>{
       return res.json({
            A:'Tushar',
            B:req.user
       });
});
module.exports = router;