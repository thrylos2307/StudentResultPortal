const e = require("express");


module.exports.user=(req,res,data,next)=>{
    console.log('req=>',req.session.type,data)
    if(req.session.type==data)
    return next();
    else{
        res.redirect('/login');
    }
}
