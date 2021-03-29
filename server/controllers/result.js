const e = require("express");
const con = require("../privacy.js");
module.exports.a = function (req, res) {
    console.log(req.body, req.session);
    var semm = req.body.sem;
    table = []
    var sql = "select * from ";
    var wher = " where ";
    try {
        con.query(`select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP('.*_${semm}_.*2018');`, function (err, result) {
            for (var i = 0; i < result.length; i++) {
                table.push(result[i].TABLE_NAME);
                sql += result[i].TABLE_NAME + " inner join "
                wher += result[i].TABLE_NAME + ".roll=" + req.session.passport.user.id + " and ";
            }
            sql = sql.slice(0, -11);
            wher = wher.slice(0, -4);
            sql = sql + wher;
            console.log(sql);
            con.query(sql, function (err1, results) {
                console.log(results[0]);
              //  results.delete("roll");
                res.render('student_result.ejs', { result: results });
            })
        });
    }
    catch {
        res.render('student_home.ejs', { sem: req.session.passport.user.Sem });
    }
}
