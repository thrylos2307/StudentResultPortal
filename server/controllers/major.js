const alert=require('alert');
const con=require("../privacy.js");
var path = require("path")
const csv=require('csvtojson');
var glob = require("glob")
const fs=require('fs');

module.exports.a = (req, res)=>{
    console.log(req.body);
    var succes=1
    ////to do convert into 2d array for printing final error 
    // lskafkl
    // ;👫 lksmdlad
    // alkmdlad
    // alkmdlad
    // a;lsdm
    for(var i=0;i<req.body.Code.length;i++)
    {
      con.query(`insert into subject_info values('${req.body.Code[i]}','${req.body.Major[i]}',${req.body.Faculty_id[i]},'${req.body.FacultyName[i]}')`,function(err,result){
        console.log(result);
        if(err){
            succes=0;
          console.log(err.sqlMessage,' while inserted value for code=',req.body.Code[i]);
          // res.redirect('/login');
          i=req.body.id.length;
        }
        else if(result){
            console.log("code=", req.body.Code[i]," got inserted !!");
          }
       
      });
    }
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
  var filepath =path.resolve(__dirname, '..');
  filepath+='/uploads/*'
  console.log(filepath);
 
  csv().fromFile(req.file.path).then((jsonObj)=>{
      console.log(jsonObj);
      for(var key in jsonObj)
      {
        //console.log(key, 'id=',jsonObj[key].id)
        con.query(`insert into subject_info values('${jsonObj[key].Code}','${jsonObj[key].Major}',${jsonObj[key].Faculty_id},'${jsonObj[key].FacultyName}')`,function(err,result){
              console.log(result);
              if(err){
                console.log(err.sqlMessage,' while inserted value for code=',jsonObj[key].Code);
                // res.redirect('/login');
              }
              else if(result){
                  console.log("code=", jsonObj[key].Code," got inserted !!");
                }
             
            });
      }
  })
  glob(filepath, function (er, files) {
    files.forEach(function(pat){
      console.log('f1=',pat);
      try{
           fs.unlinkSync(pat);
      }
      catch(e){
        console.log(e);   
     }
 })
});
  // console.log(file);
  // for(var name in file)
  // { console.log(name)
  //   fs.unlink(name);}
  res.redirect("/login");    
  
}
