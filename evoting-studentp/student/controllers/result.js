const e = require("express");
const conn = require("../privacy.js");
const util = require('util');
const query = util.promisify(conn.query).bind(conn);
module.exports.a = async (req, res) => {
    console.log(req.body, req.session);
    var semm = req.body.sem;
    // table = []
    // var sql = "select * from ";
    // var wher = " where ";
    var batch = req.session.passport.user.Batch;
    try {
        await query(`select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP('.*_${semm}_.*${batch}')`, async (err, result) => {
            if (err) {
                console.log(err);
            }
            else if (result.length) {
                // for (var i = 0; i < result.length; i++) {
                //     table.push(result[i].TABLE_NAME);
                //     sql += result[i].TABLE_NAME + " inner join "
                //     wher += result[i].TABLE_NAME + ".roll=" + req.session.passport.user.id + " and ";
                // }
                // sql = sql.slice(0, -11);

                // wher = wher.slice(0, -4);
                // sql = sql + wher;
                // console.log(sql);
                // con.query(sql, function (err1, results) {
                //     console.log(results[0]);
                //     //  results.delete("roll");
                // return res.render('student_result.ejs', { result: results });
                console.log(result);

                var tul = {};

                console.log("inside");
                for (var i in result) {
                    var a = result[i].TABLE_NAME.match(/.*[0-9]\_(.*)\_[0-9]{4}/);
                    try {
                        var res1 = await query(`select *from ${result[i].TABLE_NAME} where roll=${req.session.passport.user.id}`);
                        console.log(res1[0].roll);
                        tul[a[1]] = res1;

                    }

                    catch (e) {
                        console.log(a);
                    }
                }
                console.log('console', tul, Object.keys(tul).length);
                if (Object.keys(tul).length){
                    return res.render('student_result.ejs', { result: tul });
                }
                // for(var i in )
                // }
                // })
            }
            else
            {
                res.render('student_home.ejs', { sem: req.session.passport.user.Sem });
            }
        });
    }
    finally {
        conn.close();
    }



    return res.render('student_home.ejs', { sem: req.session.passport.user.Sem });

}
