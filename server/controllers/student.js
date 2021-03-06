const alert=require('alert');
const con=require("../privacy.js");
module.exports.a = (req, res)=>{
    console.log(req.body);
    const id=req.body.id;
    const pass=req.body.password;
   
      con.query(`insert into student_login values(${req.body.id},'${req.body.email}','${req.body.name}','${req.body.password}','${req.body.batch}','${req.body.branch}','${req.body.group}','${req.body.sem}')`,(err,result)=>{
        console.log(result);
        if(err){
         
          console.log(err);
        }
        else if(result){
            console.log("values got inserted !!");
           return  res.render("logged.ejs");
            
          }
        else{
          alert("conflic");
          res.redirect('/login');
        }
       
      });
}
