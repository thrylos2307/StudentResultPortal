const e = require("express");

module.exports.admin=(req,res)=>{
    if(req.user.login==='Admin')
    return true;
    else return false;
}
module.exports.student=(req,res)=>{
    if(req.user.login==='student_login')
    return true;
    else return false;
}
module.exports.faulty=(req,res)=>{
    if(req.body.login==='faculty_login')
    return true;
    else return false;
}

module.exports.user=(req,res,data,next)=>{
    console.log('req=>',req.session.type,data)
    if(req.session.type===data)
    return next();
    if(data==='faculty_login')
    res.render('faculty_home.ejs');
    else if(data==='student_login')
    res.render('student_home.ejs');
    else if(data==='Admin')
    res.render('logged.ejs');
}
