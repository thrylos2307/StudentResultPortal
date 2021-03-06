const alert=require('alert');
const con=require("../privacy.js");
module.exports.a = (req, res)=>{
    console.log(req.body);
    const id=req.body.id;
    const pass=req.body.password;
    console.log(id,pass);
   
      con.query(`insert into faculty_login values(${req.body.id},'${req.body.name}','${req.body.email}','${req.body.password}')`,(err,result)=>{
        console.log(result, result.length);
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
