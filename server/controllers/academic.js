const e = require("express");
const con = require("../privacy.js");
const { c } = require("./faculty.js");
const util = require('util');
const query = util.promisify(con.query).bind(con);
module.exports.create = async function (req, res) {
    console.log(req.body, req.user);
    var cannot = 0;
    await query(`select *from subject_info where Faculty_id=${req.user.id} and Code='${req.body.code.toLowerCase()}'`, async function (err1, result1) {

        if (err1 || !result1.length) {
            console.log(err1)
            cannot = 1;
            console.log("You have enter wrong subject code or wrong credential for creating table");
            req.flash("error", "sorry you cannot create table for major " + req.body.code);
            return res.redirect('/login');

        }
        else {
            console.log("authorized user");
            var table = req.body.branch.toUpperCase() + '_' + req.body.sem + '_' + req.body.code + '_' + result1[0].Major + '_' + req.body.batch_year;
            await query(`create table if not exists ?? (roll bigint primary key)`, [table], function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("result", result);
                    return res.redirect('/login');

                }
            });
        }
    });
    return res.redirect('/login');
    // else if (cannot == 2)
    //     req.flash("success", "table created for major " + req.body.code+"✔️");
}

module.exports.update = async function (req, res) {
    console.log("priting=>", req.body);
    cols = req.body;

    await query(`select *from subject_info where Faculty_id=${req.user.id} and Code='${req.body.code.toLowerCase()}'`, async function (err1, result1) {
        console.log("result not exist", err1, result1);
        if (err1 || !result1.length) {

            req.flash("error", "You have enter wrong subject code or name for creating exam");
            return res.redirect('/login');
        }
        else {
            console.log("authorized user");
            var table = req.body.branch + '_' + req.body.sem + '_' + req.body.code + '_' + result1[0].Major + '_' + req.body.batch_year;
            tables = []
            tables.push(table)
            var sql = "alter table ";
            sql += table

            if (typeof cols.col == "string") {
                sql += " add column " + cols.col + " " + cols.type + ";";
            }
            else {
                for (var i = 0; i < cols.col.length; i++) {
                    sql += " add column " + cols.col[i] + " " + cols.type[i] + ",";
                }
                sql = sql.slice(0, -1);
                sql += ";";
            }
            console.log(tables, sql);
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    if (!result) {
                        req.flash('error', "either exam already exist or you did not created valid table");
                    }
                }
                else {
                    res.result = result;
                    console.log(result);
                    req.flash('success', 'exam created');
                }
                return res.redirect('/login');
            });
        }
    });
    return res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });
}
module.exports.show = function (req, res) {
    console.log("priting=>", req.body, req.user);
    cols = req.body;
    try {
        con.query(`select Code from subject_info where Faculty_id=${req.user.id}`, function (err, result, next) {
            console.log(result);
            //  if(typeof result.Code=="string")
            //  var rq=result.Code;
            regex = '.+';
            for (var c in result)
                regex += result[c].Code + "|";

            regex = regex.slice(0, -1);
            regex += '.*';
            con.query(`select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP ?`, [regex], function (err, tableresult, next) {
                console.log(tableresult);
                tables = []
                for (var tab in tableresult) {
                    tables.push(tableresult[tab].TABLE_NAME)
                }
                console.log("inside show tables", req.session);
                return res.render('tables.ejs', { table: tables, name: req.session.passport.user.Name.toUpperCase() });
            });
        });
    }
    catch {
        return res.render('/login');
    }
    //select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP 'CSE.+[0-9]{4}$';
}
module.exports.result = async function (req, res) {
    console.log("priting result table name=>", req.body, req.user);
    cols = req.body;

    try {
        con.query(`select  *from ??`, [req.query.table], function (err, result) {
            console.log(result.length);
            if (err) {
                console.log(err);
            }
            else {
                con.query(`describe ${req.query.table}`, (err1, results1) => {
                    if (err1)
                        console.log(err1);
                    else {
                        var col = [];
                        for (var k in results1) {
                            col.push(results1[k].Field);
                        }
                        console.log(req.query.table, result);
                        req.session.table = req.query.table;
                        res.render("result.ejs", { results: result, cols: col, tablename: req.query.table });
                        // console.log("describe",col);
                    }
                });

            }
        });
    }
    catch {

        res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });
    }
    //select  TABLE_NAME from information_schema.Tables where TABLE_NAME REGEXP 'CSE.+[0-9]{4}$';
}
module.exports.resupdate = function (req, res) {
    console.log("updated values=>", req.body, req.user);

    let keys = Object.keys(req.body);
    console.log(keys);
    var js = {};
    for (var i = 1; i < keys.length; i++) {
        data = keys[i].split(" ");
        console.log(data);
        if (!js[data[0]]) {
            js[data[0]] = {}
        }
        js[data[0]][data[1]] = req.body[keys[i]];

        for (var key in js) {
            for (var ink in js[key]) {
                console.log(js[key][ink], js[key]);
            }
        }
        // js.data[0].data[1]='s';

    }

    for (var key in js) {
        var sql = "update " + req.body.table + " set ";
        for (var k in js[key]) {

            sql += k + "=" + parseFloat(js[key][k]) + ",";
        }
        sql = sql.slice(0, -1);
        sql += " where roll=" + key;
        con.query(sql, function (err, result) {
            if (err)
                throw err;
        });
    }
    res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });
}

module.exports.delete = function (req, res) {
    console.log("updated values=>", req.query);
    var roll = parseInt(req.query.roll);
    try {
        con.query(`delete from ${req.query.table} where roll=?`, [roll], function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'problem with deleting  record');
                return res.redirect('/login');
            }
            else {
                console.log(req.query.table);
                req.session.table = req.query.table;
                return res.redirect('/faculty/results?table=' + req.query.table);
            }

        });
    }
    catch {

        res.redirect('/login');
    }
}

module.exports.deltable = function (req, res) {
    console.log("updated values=>", req.query);

    try {
        con.query(`drop table ${req.query.table}`, function (err, result) {
            if (err) {
                console.log(err);
                req.flash('error', 'problem with deleting table');
                return res.redirect('/login')
            }
            else {

                req.session.table = req.query.table;
                return res.redirect('/faculty/showtables');
            }

        });
    }
    catch {

        return res.redirect('/login');
    }

}

module.exports.addresult = async function (req, res) {
    console.log("updated values=>", req.session);
    var val = [];
    var sql = "replace into " + req.session.table + "(";
    for (var i in req.body) {
        sql += i + ",";
    }
    sql = sql.slice(0, -1) + ") values(";
    console.log(typeof(req.body.roll));
    if (typeof(req.body.roll) == "string") {
        for (var k in req.body) {
            sql = sql + req.body[k] + ",";
        }
        sql = sql.slice(0, -1) + ')';
    }
    else {
        for (var k in req.body.roll) {
            var tmp = [];
            for (var i in req.body) {
                sql += req.body[i][k] + ",";
            }
            sql = sql.slice(0, -1) + "),(";
        }
        sql = sql.slice(0, -2);
    }
    console.log(sql);
    await query(sql, function (err, result) {
        if (err) {
            console.log(err, result);
            return res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });

        }
        else {
            return res.redirect('/faculty/results?table=' + req.session.table);
        }
    });


    return res.render('faculty_home.ejs', { name: req.session.passport.user.Name.toUpperCase() });


}