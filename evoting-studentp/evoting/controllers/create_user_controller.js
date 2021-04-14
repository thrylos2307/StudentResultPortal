const User = require('../models/user')
const bcrypt = require('bcrypt');
var path = require("path");
const csv = require('csvtojson');
var glob = require("glob");
var fs = require('fs');
const user = require('../models/user');
const saltRounds = 10;
module.exports.create = async function (req, res) {
    const password = req.body.password.trim();
    const id = req.body.uid.trim();
    const voter = req.body.isVoter.trim();
    const name = req.body.name.trim();
    const email = req.body.email.trim();
    if (password.length < 8 || !email || !voter || !name || !id) {
        req.flash('error','Unable to create voter!');
        console.log(err)
        return res.redirect('back');
    }
    var hash = await bcrypt.hashSync(password, saltRounds);
    User.create({ email: email, uid: id, password: hash, isVoter: voter, name: name }, (err) => {
        if (err) {
            console.log(err);
            req.flash('error','Unable to create voter!');
            return res.redirect('back');
        }
        req.flash('success','Voter created successfully');
        return res.redirect('back');
    });
}

module.exports.upload = (req, res) => {
    var filepath = path.resolve(__dirname, '..');
    filepath += '/uploads/*';
    csv().fromFile(req.file.path).then(async (jsonObj) => {
        
        for (var key in jsonObj) {
            let json = jsonObj[key];
            var hash = bcrypt.hashSync(json.password, saltRounds);
            await user.create({email : json.email, uid : json.uid, name : json.name, isVoter : json.isVoter.toLowerCase(),password: hash}, (err, data) => {
                if (err) {
                    console.log(err, 'error in creating user');
                }else{
                    req.flash('success','Voter added');
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
    return res.redirect('back');
}