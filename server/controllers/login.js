const con=require("../privacy.js");
module.exports.a = (req, res)=>{
    console.log(req.body);
    const id=req.body.id;
    const pass=req.body.password;
    if(req.body.login=='Admin')
    {
      con.query(`select * from ${req.body.login} where Name='${id}' and Password='${pass}'`,(err,result)=>{
       
        if(err){
         
          console.log(err);
        }
        else if(result.length==1){
            req.session.loggin=true;
            
            console.log("lgggedin");
           return  res.render("logged.ejs");
            
          }
        else{
          alert("wrong credential");
          res.redirect('/');
        }
      });
    }else
    {
      con.query(`select * from ${req.body.login}  where id='${id}' and password='${pass}'`,(err,result)=>{
         if(result.length==1){
          console.log("lgggedin");
          res.render("logged.ejs");
        }
        else if(err){
          console.log(err);}
          else{
          alert("wrong credential");
          res.redirect("/");
        }
      });
    }
}
