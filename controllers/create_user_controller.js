const User = require('../models/user')
const bcrypt = require('bcrypt');
var path = require("path");
const csv = require('csvtojson');
var glob = require("glob");
var fs = require('fs');
const user = require('../models/user');
const saltRounds = 10;
module.exports.create = function (req, res) {
    const password = req.body.password.trim();
    const id = req.body.id.trim();
    const voter = req.body.isVoter.trim();
    const name = req.body.name.trim();
    const email = req.body.email.trim();
    if (password.length < 8 && email && voter && name && id) {
        return res.json({ status: 'Error in creating user' });
    }
    var hash = bcrypt.hashSync(password, saltRounds);
    User.create({ email: email, uid: id, password: hash, isVoter: voter, name: name }, (err) => {
        if (err) {
            console.log(err);
            return res.json({ status: 'Error in creating user' });
        }
        return res.json('create_user');
    });
}

module.exports.upload = (req, res) => {
    var filepath = path.resolve(__dirname, '..');
    filepath += '/uploads/*';
    csv().fromFile(req.file.path).then(async (jsonObj) => {
        
        for (var key in jsonObj) {
            console.log(jsonObj[key]);
            let json = jsonObj[key];
            var hash = bcrypt.hashSync(json.password, saltRounds);
            await user.create({email : json.email, uid : json.uid, name : json.name, isVoter : json.isVoter.toLowerCase(),password: hash}, (err, data) => {
                if (err) {
                    console.log(err, 'error in creating user');
                }else{
                    console.log('created');
                }
            });
        }
    });
    glob(filepath, function (er, files) {
        files.forEach(function (pat) {
            try {
                fs.unlinkSync(pat);
            }
            catch (e) {
                console.log(e);
            }
        });
    });
    return res.render('create_user');
}