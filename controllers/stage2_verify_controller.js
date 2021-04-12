const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.verify = (req, res) => {
    const id = req.body.id;
    const password = req.body.password;
    User.findOne({ email: req.user.email }, async (err, user) => {
        if (user.uid == id) {
            if (await bcrypt.compare(password, user.password)) {
                req.session.uid = id;
                res.locals.uid = id;
                req.session.loadtime = 1;
                req.flash('success','Successfully logged in');
                return res.redirect('/');
            } else {
                req.flash('error','Incorrect id/password');
                return res.redirect('/verify/stage2');
            }
        } 
        else {
            req.flash('error','Incorrect id/password');
            return res.redirect('/verify/stage2');
         }
    });
}