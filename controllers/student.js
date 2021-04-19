const alert = require('alert');
const con = require("../privacy.js");
var path = require("path")
const csv = require('csvtojson');
var glob = require("glob")
const fs = require('fs');
const util = require('util');
const query = util.promisify(con.query).bind(con);
module.exports.a = async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const pass = req.body.password;
  console.log(id, pass, req.body.id.length);
  var succes = 1;
  console.log(typeof req.body.id);
  ////to do convert into 2d array for printing final error 
  // lskafkl
  // ;👫 lksmdlad
  // alkmdlad
  // alkmdlad
  // a;lsdm
  if (typeof req.body.id == "string") {
    await query(`insert into student_login values(${req.body.id},'${req.body.email}','${req.body.name}','${req.body.password}','${req.body.batch}','${req.body.branch}','${req.body.group}','${req.body.sem}')`, function (err, result) {
      console.log(result);
      if (err) {
        succes = 0;
        console.log(err.sqlMessage, ' while inserted value for id=', req.body.id);
        req.flash("error","value already exist "+req.body.id);
        return res.redirect("/login");
        
      }
      else if (result) {
        console.log("id=", req.body.id, " got inserted !!");
        res.redirect('/login');
      }

    });
  }
  else {
    for (var i = 0; i < req.body.id.length; i++) {
      con.query(`insert into student_login values(${req.body.id[i]},'${req.body.email[i]}','${req.body.name[i]}','${req.body.password[i]}','${req.body.batch[i]}','${req.body.branch[i]}','${req.body.group[i]}','${req.body.sem[i]}')`, function (err, result) {
        console.log(result);
        if (err) {
          succes = 0;
          console.log(err.sqlMessage, ' while inserted value for id=', req.body.id[i]);
          
          i = req.body.id.length;
        }
        else if (result) {
          console.log("id=", req.body.id[i], " got inserted !!");
        }

      });
    }
  }
  if (succes) {
    res.render("logged.ejs");
  }
  else {
    res.redirect('/login');
  }
}
module.exports.b = (req, res) => {
  console.log(req.file.path)
  // var filepath =path.resolve(__dirname, '..');
  // filepath+='/uploads/*'
  // console.log(filepath);
  // var file=[];
  // glob(filepath, function (er, files) {
  //    files.forEach(function(pat){
  //      console.log('f1=',pat);
  //      fs.unlink(pat);
  //    })
  //    file.push(files);
  // })

  csv().fromFile(req.file.path).then((jsonObj) => {
    console.log(jsonObj);
    for (var key in jsonObj) {
      //console.log(key, 'id=',jsonObj[key].id)
      con.query(`insert into student_login values(${jsonObj[key].id},'${jsonObj[key].Email}','${jsonObj[key].Name}','${jsonObj[key].Password}','${jsonObj[key].Batch}','${jsonObj[key].Branch}','${jsonObj[key].Group}','${jsonObj[key].Sem}')`, function (err, result) {
        console.log(result);
        if (err) {
          console.log(err.sqlMessage, ' while inserted value for id=', jsonObj[key].id);
          // res.redirect('/login');
        }
        else if (result) {
          console.log("id=", jsonObj[key].id, " got inserted !!");
        }

      });
    }
  })
  // console.log(file);
  // for(var name in file)
  // { console.log(name)
  //   fs.unlink(name);}
  res.redirect("/login");

}
