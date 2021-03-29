
const path=require('path');


module.exports.signIn=function(req,res){
    console.log('Im inside pass sigin func');
    console.log("print from signin func",req.body,req.cookies,req.session,req.user);
    if(req.isAuthenticated()){
        console.log('forwarding for ejs sign in');
        console.log(req.session.passport.login);
        return res.render('logged.ejs');
    }
    console.log(req.cookies,'cookies');
    
    return res.render('login.ejs');

}


module.exports.createSession=function(req,res){
    
    //req.flash('success','Logged in Successfully');
    console.log('creating session and sending to further ejs');
    console.log('create session result=>',req.body,res.body,req.cookies,req.session,req.user);
    if(req.body.login==='Admin')
    {
        return res.render('logged.ejs');
    }
    else if(req.body.login==='student_login')
    {     console.log(req.session.passport.user.Sem);
        return res.render('student_home.ejs',{sem:req.session.passport.user.Sem});
    }
    else if(req.body.login==='faculty_login')
    {
        return res.render('faculty_home.ejs',{name:req.session.passport.user.Name.toUpperCase()});
    }
}

// module.exports.destroySession=function(req,res){
//     /*Passport exposes a logout() function on req that can be called from any 
//     route handler which needs to terminate a login session.
//     Invoking logout() will remove the req.user property and clear the login session 
//     */ 
//     req.logout();
//     //creating a flash message
//     req.flash('success','You have Logged out');

//     //then redirecting to home page.
//     return res.redirect('/');
// }
