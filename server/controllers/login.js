const con = require("../privacy.js");
const bcrypt = require('bcrypt');
const transporter = require('../config/nodemailer').transporter;
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
      }
      else {
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

  con.query(`SELECT * FROM ${req.body.table} WHERE email = ? `, [email], async function (error, results) {
    console.log(results);
    if (results.length == 1) {

      const otp = Math.floor(Math.random() * 99999) + "";
      var encry_token = bcrypt.hashSync(otp, 10);
      con.query('insert into forget_password_token(email , token  , created_at ) values(?,?,?)', [email, encry_token, new Date()], function (error, results) {
        if (error) {
          console.log(error);
          res.render('./forgot_password.ejs');

        }

      });

      var mailOptions = {
        from: 'testcodeial@gmail.com',
        to: email,
        subject: 'OTP for password change for codeial will expire in 2 minutes',
        text: otp
      };
      try {
        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            con.query('delete from forget_password_token where email=?', [email]);

            //   f_user.findOneAndDelete({userId: req.user._id});
            return res.redirect('/forget_password');
          } else {
            console.log('Email sent: ' + info.response);
            console.log("going to otp ejs ");
            res.render('otp.ejs', { email: email });


          }
        });
      }
      catch (e) {
        console.log(e);
      }

    }

  });
}
module.exports.otp = (req, res) => {
  console.log(req.session);
  con.query('select * from forget_password_token where email =?', [req.session.email], async (err, data) => {

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
      await con.query('delete from forget_password_token where email=?', [req.session.email]);
      return res.render('forgot_password.ejs')
    }
    const token_match = await bcrypt.compare(req.body.otp, data[0].token);
    if (token_match) {
      await con.query('delete from forget_password_token where email=?', [req.session.email]);

      return res.render('new_f_password.ejs');
    } else {
      res.redirect('/forget_password');
    }
  });
}
module.exports.cp = async (req, res) => {
  console.log("cp=> ", req.body, req.session);
  const new_pass = req.body.new_password;
  const conf_pass = req.body.confirm_password;
  console.log(new_pass);
  if (new_pass === conf_pass) {
    //   const encrp_pass = await bcrypt.hashSync(new_pass, 10);
    await con.query(`update ${req.session.type} set password=? where email=?`, [new_pass, req.session.email], (err, done) => {
      if (err) {
        console.log('unable to change password');
        return res.render('new_f_password.ejs');
      } else {
        console.log('password change done');
        return res.redirect('/login');
      }
    });
  } else {

    console.log('both pass do not match');
    return res.render('new_f_password.ejs');
  }
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
    return res.redirect('/changepassword');
  }
  else if (req.body.oldpwd !== req.session.passport.user.Password) {
    console.log("password do not match",req.body.oldpassword,req.session.passport.user.Password);
    return res.redirect('/changepassword');
  }
  try {
    sql = "update " + req.session.passport.user.login + " set Password='" + newpwd + "' where Email='" + req.session.passport.user.Email + "'";
    console.log(sql);
    await con.query(`update ${req.session.passport.user.login} set Password=? where Email=?`,[newpwd,req.session.passport.user.Email],(err,done)=>{
      if(err)
      console.log(err);
      else{
        console.log("password updated");
        res.redirect('/logout');
      }
    });
  }
  catch (e) {
    console.log(e);
    return res.redirect('/changepassword');
  }
  // (err, done) => {
  //   if (err)
  //     console.log(err);
  //   else {


  //   }
  // });

  //   console.log("query executed", done[0].Password);
  //   if (err) {
  //     console.log(err);
  //   } 
  //   else if (done[0].Password == req.body.oldpassword) {
  //     sql = "update " + req.session.passport.user.login + " set Password='" + newpwd + "' where Email='" + req.session.passport.user.Email + "'";
  //     console.log(sql);
  //     con.query(sql, (err1, done1) => {
  //       if (err1) {

  //         console.log(err1);
  //       }
  //       else {
  //         console.log("hello", done1);
  //         console.log('password change done');
  //         r = true;
  //       }
  //     });
  //   }

  // });
  // console.log("value r", r);
  // if (!r)
  //   return res.redirect('/logout');
  // else

}