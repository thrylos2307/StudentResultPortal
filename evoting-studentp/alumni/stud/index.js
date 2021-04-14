const http = require('http');
const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
var app = express();
app.set('view engine', 'ejs');

const bcrypt = require('bcrypt');
const transporter = require('./config/nodemailer').transporter;
console.log(transporter);
console.log(require('./config/nodemailer'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',

    charset: 'utf8'
});



function setResHtml(sql, cb) {
    pool.getConnection((err, con) => {
        if (err) throw err;

        con.query(sql, (err, res, cols) => {
            if (err) throw err;

            return cb(res);
        });
    });
}

app.get('/', function (request, response) {
    response.redirect('/login');
});

app.get('/forgot_password', function (request, response) {
    response.render('./forgot_password.ejs');
});
app.post('/forgot_password/email', function (req, res) {
    var email = req.body.email;
    pool.query('SELECT * FROM login WHERE email = ? ', [email], async function (error, results, fields) {

        if(results.length==0)
        {
            return res.render('./forgot_password.ejs');
        }
        if (results.length == 1) {

            const otp = Math.floor(Math.random() * 99999) + "";
            var encry_token = await bcrypt.hashSync(otp, 10);
            await pool.query('replace into forget_password_token(email , token  , created_at ) values(?,?,?)', [email, encry_token, new Date()], function (error, results, fields) {
                if (error) {
                    console.log(error);
                    return res.render('./forgot_password.ejs');

                }

            });

            var mailOptions = {
                from: 'testcodeial@gmail.com',
                to: email,
                subject: 'OTP for password change for codeial will expire in 2 minutes',
                text: otp
            };
            try {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        pool.query('delete from forget_password_token where email=?', [email]);

                        //   f_user.findOneAndDelete({userId: req.user._id});
                        return res.redirect('/forgot_password');
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.render('./otp.ejs', { email: email });


                    }
                });
            }
            catch (e) {
                console.log(e);
                return res.redirect('/login');
            }

        };

    });
});

app.post('/forgot_password/otp', (req, res) => {
var email=req.body.email;
    pool.query('select * from forget_password_token where email =?', [req.body.email], async (err, data) => {
        if (err) {
            console.log(err);
            return res.render('./otp.ejs', { email: email });
            // return  res.redirect('/forget_password');

        }
        var ppp=new Date(new Date(data[0].created_at).getTime() + (2 * 60 * 1000));
        var ppp1=new Date();
        var hr=((ppp-ppp1)/60000)/60;
        var min=((ppp-ppp1)/60000);
        var sec=((ppp-ppp1)/1000);
        var days=((ppp-ppp1)/60000)/60/24;


        if(hr<0 || min<0 || sec<0 || days<0 )
        {
            await pool.query('delete from forget_password_token where email=?', [req.body.email]);
            return res.render('./forgot_password.ejs');
        }
        const token_match = await bcrypt.compare(req.body.otp, data[0].token);
        if (token_match) {
            await pool.query('delete from forget_password_token where email=?', [req.body.email]);

            return res.render('./new_f_password', { email: req.body.email });
        } else {
            return res.render('./otp.ejs',{email: req.body.email});
        }
    });
});

app.post('/forgot_password/cp',  async (req, res) => {
    const new_pass = req.body.new_password;
    const conf_pass = req.body.confirm_password;
    console.log(new_pass);
    if (new_pass === conf_pass) {
        //   const encrp_pass = await bcrypt.hashSync(new_pass, 10);
        await pool.query('update login set password=? where email=?', [new_pass, req.body.email], (err, done) => {
            if (err) {
                console.log('unable to change password');
                return res.render('./new_f_password.ejs');
            } else {
                console.log('password change done');
                return res.render('./login');
            }
        });
    } else {

        console.log('both pass do not match');
        return res.render('./new_f_password.ejs');
    }
});



app.get('/login', function (request, response) {
    response.render('./login.ejs', { stat: 1 });
});

app.post('/login', function (request, response) {
    var roll = request.body.roll;
    var password = request.body.password;
    var email = request.body.email;
    // roll=roll.trim();
    // password=password.trim();
    // email=email.trim();
    //console.log(roll,email,password);
    if (roll && password && email) {
        pool.query('SELECT * FROM login WHERE roll = ? AND password = ? AND email = ?', [roll, password, email], function (error, results, fields) {

            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.roll = roll;
                return response.redirect('/home');
            }
            return response.send('invalid');
            // else {
            //     // request.flash('message', 'This is a message from the "/" endpoint');
            //     // response.redirect('./alert');

            //     response.send('invalid');
            //     console.log("WRONG input");

            //     response.render('./login.ejs', { stat: 0 });

            // }
            // response.end();
        });
    } else {
        response.send('Please enter roll and Password!');
        response.end();
    }
});

app.get('/home', isLoggedIn, function (req, res) {
    res.render('./home.ejs');
});

app.post('/home', function (req, res) {
    var type = req.body.Type.toUpperCase();
    if (type === "LOGOUT") {
        res.redirect('/logout');
    }
    else if (type === "EVENT") {
        res.redirect('/event');
    }
    else if (type === "JOBS") {
        res.redirect('/jobs');
    }
    else if (type === "INTERNSHIPS") {
        res.redirect('/internships');
    }
    else if (type === "BATCH") {
        res.redirect('/batch');
    }
    else if (type === "ABOUT") {
        res.redirect('/about');
    }
    else if (type === "APPLY") {
        res.redirect('/apply');
    }
    else if (type === "REACHOUT") {
        res.redirect('/reachout');
    }
});

app.get('/logout', isLoggedIn, (req, res) => {
    // req.session.loggedin = false;
    res.redirect('/login');
});
// app.get('/event', (req, res) => {
// 	setResHtml("SELECT * from event", (responseData) => {
// 		res.render('./event.ejs', { data: responseData });
// 	});
// });

app.get('/batch', function (req, res) {

    res.render('batch');
});


app.get('/about', function (req, res) {

    res.render('about');
});

app.get('/reachout', function (req, res) {

    res.render('reachout');
});



var year;
app.post('/batch', function (request, response) {
    year = request.body.year;

    if (year) {
        pool.query('SELECT * FROM batch WHERE year = ? ', [year], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.year = year;
                response.redirect('/batchwise');
            } else {
                response.send('Incorrect year');
            }
            response.end();
        });
    } else {
        response.send('Please enter year');
        response.end();
    }
});
//app.get('/batchwise', isLoggedIn, (req, res) => {
//setResHtml("SELECT * FROM batchwise natural join listing natural join batchwise where batchwise.year=" + req.session.year, (responseData) => {
//res.render('./batchwise.ejs', { data: responseData });
//});
//});
app.get('/batchwise', (req, res) => {
    var sql1 = "SELECT * FROM batchwise natural join batch where batchwise.year=";

    var sql = sql1.concat(year);
    //console.log(sql);
    pool.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result[0].pic);
            //var i;
            //for (i = 0; i < result.length; i++) {
            //console.log(result[i].pic);
            //} 

            let temp = result.map(row => { return { pic: row.pic.toString('base64'), roll: row.roll, name: row.name, year: row.year, branch: row.branch, reach_out: row.reach_out } });
            res.render("batchwise", { temp: temp });
            //console.log(temp,result);
        }
    });
    //console.log(sql);



});




app.get('/event', (req, res) => {
    var sql = "SELECT * from event";


    pool.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result[0].pic);
            //var i;
            //for (i = 0; i < result.length; i++) {
            //console.log(result[i].pic);
            //} 

            let temp = result.map(row => { return { serial_num: row.serial_num, message: row.message, before_start: row.before_start } });
            res.render("event", { temp: temp });
            //console.log(temp,result);
        }
    });
    //console.log(sql);



});


app.get('/apply', (req, res) => {
    var sql = "SELECT * from apply";


    pool.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result[0].pic);
            //var i;
            //for (i = 0; i < result.length; i++) {
            //console.log(result[i].pic);
            //} 

            let temp = result.map(row => { return { company: row.company, position: row.position, contact: row.contact } });
            res.render("apply", { temp: temp });
            //console.log(temp,result);
        }
    });
    //console.log(sql);



});






app.get('/jobs', (req, res) => {
    var sql = "SELECT * from jobs";


    pool.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result[0].pic);
            //var i;
            //for (i = 0; i < result.length; i++) {
            //console.log(result[i].pic);
            //} 

            let temp = result.map(row => { return { pic: row.pic.toString('base64'), roll: row.roll, name: row.name, batch: row.batch, branch: row.branch, working_at: row.working_at, reach_out: row.reach_out } });
            res.render("jobs", { temp: temp });
            //console.log(temp,result);
        }
    });
    //console.log(sql);



});


app.get('/internships', (req, res) => {
    var sql = "SELECT * from internships";


    pool.query(sql, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            //console.log(result[0].pic);
            //var i;
            //for (i = 0; i < result.length; i++) {
            //console.log(result[i].pic);
            //} 

            let temp = result.map(row => { return { pic: row.pic.toString('base64'), roll: row.roll, name: row.name, batch: row.batch, branch: row.branch, intern_at: row.intern_at, reach_out: row.reach_out } });
            res.render("internships", { temp: temp });
            //console.log(temp,result);
        }
    });
    //console.log(sql);



});








function isLoggedIn(req, res, next) {
    if (req.session.loggedin) {
        return next();
    }
    res.send("Not Logged In");
}



app.listen(7001, () => {
    console.log("Connected to 7001");
});
