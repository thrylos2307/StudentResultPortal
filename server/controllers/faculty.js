const alert=require('alert');
const con=require("../privacy.js");
const fs=require('fs');
module.exports.a = (req, res)=>{
    console.log(req.body);
    const id=req.body.id;
    const pass=req.body.password;
    console.log(id[0],pass[0],req.body.id.length);
    var succes=1;
    console.log(typeof req.body);
    ////to do convert into 2d array for printing final error 
    // lskafkl
    // ;👫 lksmdlad
    // alkmdlad
    // alkmdlad
    // a;lsdm
    // for(var i=0;i<req.body.id.length;i++)
    // {
    //   con.query(`insert into faculty_login values(${req.body.id[i]},'${req.body.name[i]}','${req.body.email[i]}','${req.body.password[i]}')`,function(err,result){
    //     console.log(result);
    //     if(err){
    //         succes=0;
    //       console.log(err,' while inserted value for id=',req.body.id[i]);
    //       // res.redirect('/login');
    //       i=req.body.id.length;
    //     }
    //     else if(result){
    //         console.log("id=", req.body.id[i]," got inserted !!");
    //       }
       
    //   });
    // }
    if(succes)
    {
      res.render("logged.ejs");
    }
    else
    {
      res.redirect('/login');
    }
}
module.exports.b= (req, res)=>{  
  console.log(req.file.path)
  csv().fromFile(req.file.path).then((jsonObj)=>{
      console.log(jsonObj);
  })
  res.redirect("/login");    
 
}
