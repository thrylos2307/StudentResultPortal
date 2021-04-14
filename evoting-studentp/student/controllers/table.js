const e = require("express");
const con = require("../privacy.js");
const util = require('util');
const query = util.promisify(con.query).bind(con);
module.exports.show = function (req, res) {
    console.log("table=>", req.query);
    var table =req.query.table;
    try {
        con.query(`select * from ${req.query.table}`, function (err, result) {
            if (err)
                console.log(err);
            else {
                for (var key in result)
                    delete (result[key].Password);

                console.log(result.length);
                res.render('admin_tables.ejs',{table:result, name:req.query.table});
            }

        });
    }
    catch {
        res.render('logged.ejs');
    }
}
module.exports.delete = function (req, res) {
    console.log("table=>", req.query);
   
    var table =req.query.table;
    var id="";
    if (table=='subject_info')
    {
        id="Code";
    }
    else
    {
        id="id";
    }
    var kid=req.query[id];
    console.log(table,kid,id);
    try {
        con.query(`delete from ${req.query.table} where ${id}=?`,[kid], function (err, result) {
            if (err)
            {
                console.log("error",err);
                req.flash("error","cannot delete data first delete their other major record");
                res.redirect('/admin/showtables?table='+table);
            }
            else {
                console.log(table);
                res.redirect('/admin/showtables?table='+table);
            }

        });
    }
    catch {
        res.render('logged.ejs');
    }
}

module.exports.update = async function (req, res) {
    console.log("table=>", req.query);
    var table =req.query.table;
    const m=6;
    var month=new Date().getMonth();
    return res.redirect('/admin/showtables?table=student_login');
    c
    // try {
    //     await query(`select distinct(Batch) from student_login`, async function (err, result){
    //         if (err)
    //         {
    //             console.log(err);
    //             req.flash("error","something went wrong while updating sem..");
    //             return res.redirect('/admin/showtables?table=student_login');
    //         }
    //         else {
    //             const m=6;
    //             console.log(result);
    //             var month=new Date().getMonth();
    //             return res.redirect('/admin/showtables?table=student_login');
    //         }
    //     });
    // }
    // catch {
    //    return res.redirect('/admin/showtables?table=student_login');
    // }
}