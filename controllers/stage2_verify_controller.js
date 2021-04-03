const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.verify = (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    User.findOne({ email: req.user.email }, async (err, user) => {
        if (user.uid == id) {
            if (await bcrypt.compare(password, user.password)) {
                req.session.uid = id;
                return res.redirect('/home');
            } else {
                return res.render('stage2');
            }
        } 
        else {
            return res.render('stage2');
         }
    });
}