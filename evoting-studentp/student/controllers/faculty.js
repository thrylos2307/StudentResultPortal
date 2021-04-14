const alert = require('alert');
const con = require("../privacy.js");
var path = require("path")
const csv = require('csvtojson');
var glob = require("glob")
const fs = require('fs');
const { json } = require('body-parser');
const util = require('util');
const query = util.promisify(con.query).bind(con);
module.exports.a = async (req, res) => {
  console.log(req.body);
  const id = req.body.id;
  const pass = req.body.password;
  console.log(id[0], pass[0], req.body.id.length);
  var succes = 1;
  console.log(typeof req.body);
  ////to do convert into 2d array for printing final error 
  // lskafkl
  // ;👫 lksmdlad
  // alkmdlad
  // alkmdlad
  // a;lsdm
  if (typeof req.body.id == "string") {
    await query(`insert into faculty_login values(${req.body.id},'${req.body.name}','${req.body.email}','${req.body.password}')`, function (err, result) {
      if (err) {
        succes = 0;
        console.log(err.sqlMessage, ' while inserted value for id=', req.body.id);
        req.flash("error", "data already exist "+req.body.id);
        
        return res.redirect("/login");
      }
      else if (result) {
        succes = 1;
        console.log("id=", req.body.id, " got inserted !!");
        res.redirect('/login');
      }

    });
  }
  else {
    for (var i = 0; i < req.body.id.length; i++) {
      con.query(`insert into faculty_login values(${req.body.id[i]},'${req.body.name[i]}','${req.body.email[i]}','${req.body.password[i]}')`, function (err, result) {
        
        if (err) {
          succes = 0;
          console.log(err.sqlMessage, ' while inserted value for id=', req.body.id[i]);
          req.flash("error", "data already exist "+req.body.id[i]);
        
          res.locals.error=req.flash('error');
          i=req.body.id.length
         
        }
        else  {
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
  var filepath = path.resolve(__dirname, '..');
  filepath += '/uploads/*'
  console.log(filepath);

  csv().fromFile(req.file.path).then((jsonObj) => {
    console.log(jsonObj);
    for (var key in jsonObj) {
      //console.log(key, 'id=',jsonObj[key].id)
      con.query(`insert into faculty_login values(${jsonObj[key].id},'${jsonObj[key].Name}','${jsonObj[key].Email}','${jsonObj[key].Password}')`, function (err, result) {
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
  glob(filepath, function (er, files) {
    files.forEach(function (pat) {
      console.log('f1=', pat);
      try {
        fs.unlinkSync(pat);
      }
      catch (e) {
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
module.exports.c = async (req, res) => {
  console.log(req.file.path)
  var filepath = path.resolve(__dirname, '..');
  filepath += '/uploads/*'
  console.log(req.session);

  csv().fromFile(req.file.path).then(async (jsonObj) => {
    console.log(jsonObj);
    var sql = "replace into " + req.session.table + "(";
    for (var k in jsonObj[0])
      sql += k + ",";

    sql = sql.slice(0, -1) + ") values(";
    for (var k in jsonObj) {
      var sql1 = sql;
      for (var i in jsonObj[k]) {
        sql1 = sql1 + jsonObj[k][i] + ",";
      }
      sql1 = sql1.slice(0, -1) + ")";

      console.log("aql=>", sql);
      await con.query(sql1, (err, result) => {
        if (err) {
          console.log(err);
          req.flash('error', "error while updating value for" + jsonObj[k].roll);
        }
      });
    }
  })
  glob(filepath, function (er, files) {
    files.forEach(function (pat) {
      console.log('f1=', pat);
      try {
        fs.unlinkSync(pat);
      }
      catch (e) {
        console.log(e);
      }
    })
  });

  return res.redirect("/faculty/results?table=" + req.session.table);

}
