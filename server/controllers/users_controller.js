
const path=require('path');


module.exports.signIn=function(req,res){
    console.log('Im inside pass sigin func');
    if(req.isAuthenticated()){
        console.log('forwarding for log ejs');
        return res.render('logged.ejs');
    }
    console.log(req.cookies,'cookies');
    
    return res.render('login.ejs');

}


module.exports.createSession=function(req,res){
    
    //req.flash('success','Logged in Successfully');
    console.log(' creating session and sending to logged ejs');
    return res.render('logged.ejs');
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
