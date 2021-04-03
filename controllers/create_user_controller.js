const User = require('../models/user')
const bcrypt = require('bcrypt');

module.exports = function(req, res){
    const saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);
    User.create({email : req.body.email, uid : req.body.id, password : hash, isVoter : req.body.isVoter, name: req.body.name}, (err) =>{
        if(err){
            console.log(err);
            return res.json({status: 'Error in creating user'});
        }
        return res.json({status: 'created user'});
    });
}