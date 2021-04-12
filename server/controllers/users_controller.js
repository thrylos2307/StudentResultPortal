
const path = require('path');


module.exports.signIn = function (req, res) {
  console.log('Im inside pass sigin func');
  // console.log("print from signin func",req.body,req.cookies,req.session,req.user);
  if (req.isAuthenticated()) {
    console.log('forwarding for ejs sign in');
    console.log(req.session.passport.user.login);
    if (req.session.passport.user.login == 'Admin')
      return res.render('logged.ejs');
    else if (req.session.passport.user.login == 'faculty_login')
      return res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });
    else if (req.session.passport.user.login == 'student_login')
      return res.render('student_home.ejs', { sem: req.session.passport.user.Sem });

  }
  else {
    if(!req.session.passport);
    req.flash('error', "Invalid credential...");
    return res.redirect('/');
  }

}


module.exports.createSession = function (req, res) {

  //req.flash('success','Logged in Successfully');
  console.log('creating session and sending to further ejs');


  if (req.body.login == 'Admin') {
    return res.render('logged.ejs');
  }
  else if (req.body.login == 'student_login') {    // console.log(req.session.passport.user.Sem);
    //    req.flash("success","Successfully logged in !!");
    return res.render('student_home.ejs', { sem: req.session.passport.user.Sem });
  }
  else if (req.body.login == 'faculty_login') {
    // req.flash("success","Successfully logged in !!");
    return res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });
  }

}


