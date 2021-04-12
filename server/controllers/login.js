const con = require("../privacy.js");
const bcrypt = require('bcrypt');
const transporter = require('../config/nodemailer').transporter;
const util = require('util');
const { RSA_NO_PADDING } = require("constants");
const query = util.promisify(con.query).bind(con);
module.exports.a = (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const pass = req.body.password;
  if (req.body.login == 'Admin') {
    con.query(`select * from ${req.body.login} where Name='${id}' and Password='${pass}'`, (err, result) => {

      if (err) {

        console.log(err);
      }
      else if (result.length == 1) {
        req.session.loggin = true;

        console.log("lgggedin");
        return res.render("logged.ejs");

      }
      else {
        alert("wrong credential");
        res.redirect('/');
      }
    });
  } else {
    con.query(`select * from ${req.body.login}  where id='${id}' and password='${pass}'`, (err, result) => {
      if (result.length == 1) {
        console.log("lgggedin");
        res.render("logged.ejs");
      }
      else if (err) {
        console.log(err);
        alert("wrong credential");
        res.redirect("/");
      }
    });
  }
}

module.exports.forgot = async (req, res) => {
  console.log("forget password", req.body);
  req.session.type = req.body.table;
  req.session.email = req.body.email;
  var email = req.body.email;
  try {
    await query(`select * from ${req.body.table} where email = ? `, [email], async function (error, results) {
      console.log(error, results)
      if (error || !results.length) {
        console.log("wrong cre", error, results);
        req.flash("error", "you have entered wrong credential");
        return res.redirect('/forgot_password');

      }
      else if (results.length == 1) {

        const otp = Math.floor(Math.random() * 99999) + "";
        var encry_token = bcrypt.hashSync(otp, 10);
        await query('replace into forget_password_token(email , token  , created_at ) values(?,?,?)', [email, encry_token, new Date()], async function (err, results1) {
          if (err) {
            console.log(err);
            return res.redirect('/forgot_password');
          }
          var mailOptions = {
            from: 'testcodeial@gmail.com',
            to: email,
            subject: 'Forget password of student portal ',
            text: "this is your otp :"+otp+" valid for 2 min",
          };
          try {
            transporter.sendMail(mailOptions, async function (err1, info) {
              if (err1) {
                console.log(err1);
                await query('delete from forget_password_token where email=?', [email]);

                //   f_user.findOneAndDelete({userId: req.user._id});
                return res.redirect('/forgot_password');
              } else {
                console.log('Email sent: ' + info.response);
                console.log("going to otp ejs ");
                req.flash("success", "otp has sent to your email, valid for 2 min!!");
                res.locals.message = req.flash('success');
                return res.render('otp.ejs', { email: email });


              }
            });
          }
          catch (e) {
            console.log(e);
          }
        });
      }

    });
  }
  catch (e) {
    console.log(e);
  }
  return res.redirect('/forgot_password');
}
module.exports.otp = async (req, res) => {
  console.log(req.session);
  var email = req.session.email;
  try {
    await query('select * from forget_password_token where email =?', [req.session.email], async (err, data) => {

      if (err) {
        console.log(err);
        return res.render('otp.ejs', { email: email });
        // return  res.redirect('/forget_password');

      }
      var ppp = new Date(new Date(data[0].created_at).getTime() + (2 * 60 * 1000));
      var ppp1 = new Date();
      var hr = ((ppp - ppp1) / 60000) / 60;
      var min = ((ppp - ppp1) / 60000);
      var sec = ((ppp - ppp1) / 1000);
      var days = ((ppp - ppp1) / 60000) / 60 / 24;


      if (hr < 0 || min < 0 || sec < 0 || days < 0) {
        await query('delete from forget_password_token where email=?', [req.session.email]);
        req.flash("error", "otp expired");
        return res.redirect('/forgot_password');
      }
      const token_match = await bcrypt.compare(req.body.otp, data[0].token);
      if (token_match) {
        await query('delete from forget_password_token where email=?', [req.session.email]);

        return res.render('new_f_password.ejs');
      } else {
        req.flash("error", "Entered wrong otp");
        res.locals.error = req.flash("error");
        return res.render('otp.ejs', { email: email });
      }
    });
  }
  catch (e) {
    return res.rediect('/login');
  }
  return res.rediect("/login");
}
module.exports.cp = async (req, res) => {
  console.log("cp=> ", req.body, req.session);
  const new_pass = req.body.new_password;
  const conf_pass = req.body.confirm_password;
  var cond = new_pass.match(/("true"|or|-)|[^a-zA-Z0-9@_]/g);
  if (cond) {
    req.flash("error","password should be alphanumeric|@|_ ");
        res.locals.error=req.flash('error');
        return res.render('new_f_password.ejs');
  }
  console.log(new_pass);
  if (new_pass == conf_pass) {
    //   const encrp_pass = await bcrypt.hashSync(new_pass, 10);
    await query(`update ${req.session.type} set password=? where email=?`, [new_pass, req.session.email], (err, done) => {
      if (err) {
        console.log('unable to change password');
        req.flash("error","unable to change password");
        res.locals.error=req.flash('error');
        return res.render('new_f_password.ejs');
      } else {
        console.log('password change done');
        delete req.session.type;
        delete req.session.email;
        req.flash('success',"Password changed");
        return res.redirect('/passchange');
      }
    });
  } 
    return res.render('new_f_password.ejs');
  
}
module.exports.cgpwd = async (req, res) => {
  console.log("cgpwd=> ", req.body, req.session);
  var newpwd = req.body.newpwd;

  console.log(newpwd);
  console.log(newpwd.match(/("true"|or|-)|[^a-zA-Z0-9@_]/g));
  var cond = newpwd.match(/("true"|or|-)|[^a-zA-Z0-9@_]/g);
  let r = false;
  if (cond) {
    console.log("password should be aplanumeric");
    req.flash("error","password should be aplanumeric|@|_")
    return res.redirect('/changepassword');
  }
  else if (req.body.oldpwd !== req.session.passport.user.Password) {
    console.log("password do not match", req.body.oldpassword, req.session.passport.user.Password);
    req.flash("error","old password doesn't match");
    return res.redirect('/changepassword');
  }
  try {
    sql = "update " + req.session.passport.user.login + " set Password='" + newpwd + "' where id='" + req.session.passport.user.id + "'";
    console.log(sql);
    await con.query(`update ${req.session.passport.user.login} set Password=? where id=?`, [newpwd, req.session.passport.user.id], (err, done) => {
      if (err)
      {
        console.log(err);
        req.flash("error","something went wrong while updating password");
        res.redirect('/changepassword');
    }
      else {
        console.log("password updated");
        req.flash("success","password changed successfully ");
        res.redirect('/logout');
      }
    });
  }
  catch (e) {
    console.log(e);
    req.flash("error","something went wrong while updating password");
    return res.redirect('/changepassword');
  }

}