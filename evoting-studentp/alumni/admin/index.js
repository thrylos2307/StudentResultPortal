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

const multer = require('multer');
//const upload = multer({ dest: `./static/images/` });       


var fs = require("fs");

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
    pool.query('SELECT * FROM admin WHERE email = ? ', [email], async function (error, results, fields) {

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
        await pool.query('update admin set password=? where email=?', [new_pass, req.body.email], (err, done) => {
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
    if (roll && password && email) {

        pool.query('SELECT * FROM admin WHERE roll = ? AND password = ? AND email = ?', [roll, password, email], function (error, results, fields) {

            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.roll = roll;
                return response.redirect('/home');
            }
            return response.send('invalid');
            //  else {




                
               
            //     console.log("WRONG input");
                
            //     //  response.render('./login.ejs', { stat: 0 });

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

app.post('/home',isLoggedIn, function (req, res) {
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
    //  req.session.loggedin = false;
    res.redirect('/login');
});
// app.get('/event', (req, res) => {
// 	setResHtml("SELECT * from event", (responseData) => {
// 		res.render('./event.ejs', { data: responseData });
// 	});
// });

app.get('/batch',isLoggedIn, function (req, res) {

    res.render('batch');
});


app.get('/about',isLoggedIn, function (req, res) {

    res.render('about');
});

app.get('/reachout',isLoggedIn, function (req, res) {

    res.render('reachout');
});






app.get('/event',isLoggedIn, (req, res) => {
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
app.post('/event',isLoggedIn, function (req, res) {
    var type = req.body.update_event.toUpperCase();
    if (type === "REMOVE_EVENT") {
        res.redirect('/remove_event');
    } else if (type === "ADD_EVENT") {
        res.redirect('/add_event');
    }
});
app.get('/add_event',isLoggedIn, isLoggedIn, (req, res) => {
    res.render('./add_event.ejs');
});

app.post('/add_event',isLoggedIn, function (req, res) {

    var serial_num = req.body.serial_num;
    var message = req.body.message;


    pool.query('insert into event(serial_num,message,before_start) values(?,?,?)', [serial_num, message, new Date()], function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/event');
    });
});
app.get('/remove_event',isLoggedIn, isLoggedIn, (req, res) => {

    res.render('./remove_event.ejs');
});

app.post('/remove_event',isLoggedIn, function (req, res) {
    var serial_num = req.body.serial_num;
    pool.query('delete from event where serial_num=' + serial_num + '', function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/event');
    });
});


app.get('/apply',isLoggedIn, (req, res) => {
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

app.post('/apply',isLoggedIn, function (req, res) {
    var type = req.body.update_apply.toUpperCase();
    if (type === "REMOVE_APPLY") {
        res.redirect('/remove_apply');
    } else if (type === "ADD_APPLY") {
        res.redirect('/add_apply');
    }
});
app.get('/add_apply',isLoggedIn, isLoggedIn, (req, res) => {
    res.render('./add_apply.ejs');
});

app.post('/add_apply',isLoggedIn, function (req, res) {

    var company = req.body.company;
    var position = req.body.position;
    var contact = req.body.contact;


    pool.query('insert into apply(company,position,contact) values(?,?,?)', [company, position, contact], function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/apply');
    });
});
app.get('/remove_apply',isLoggedIn, isLoggedIn, (req, res) => {

    res.render('./remove_apply.ejs');
});

app.post('/remove_apply',isLoggedIn, function (req, res) {
    var company = req.body.company;

    pool.query("delete  FROM apply WHERE company =  '" + company + "'", function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/apply');
    });
});







app.get('/internships',isLoggedIn, (req, res) => {
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




app.post('/internships',isLoggedIn, function (req, res) {
    var type = req.body.update_intern.toUpperCase();
    if (type === "REMOVE_INTERN") {
        res.redirect('/remove_intern');
    } else if (type === "ADD_INTERN") {
        res.redirect('/add_intern');
    }
});
app.get('/add_intern', isLoggedIn, (req, res) => {
    res.render('./add_intern.ejs');
});
var path = require('path')
const DIR = './static/images';
let storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, DIR);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage });
app.post('/add_intern',isLoggedIn, upload.single('pic'), function (req, res) {

    //console.log(req.body);
    //console.log(req.file);
    //console.log(req.files);

    //   var pic = req.file.filename ;
    var roll = req.body.roll;
    var name = req.body.name;
    var batch = req.body.batch;
    var branch = req.body.branch;
    var intern_at = req.body.intern_at;
    var reach_out = req.body.reach_out;

    //var path = "./static/images"+ req.body.pic;

    fs.readFile(req.file.path, (err, data) => {
        console.log(data);

        pool.query('insert into internships(pic,roll,name,batch,branch,intern_at,reach_out) values(?,?,?,?,?,?,?)', [data, roll, name, batch, branch, intern_at, reach_out], function (error, results, fields) {
            if (error) console.log(error);
            res.redirect('/internships');
        });
    });
});

app.get('/remove_intern',isLoggedIn, isLoggedIn, (req, res) => {

    res.render('./remove_intern.ejs');
});

app.post('/remove_intern',isLoggedIn, function (req, res) {
    var roll = req.body.roll;
    pool.query('delete from internships where roll=' + roll + '', function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/internships');
    });
});











app.get('/jobs',isLoggedIn, (req, res) => {
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


app.post('/jobs',isLoggedIn, function (req, res) {
    var type = req.body.update_job.toUpperCase();
    if (type === "REMOVE_JOB") {
        res.redirect('/remove_job');
    } else if (type === "ADD_JOB") {
        res.redirect('/add_job');
    }
});
app.get('/add_job',isLoggedIn, isLoggedIn, (req, res) => {
    res.render('./add_job.ejs');
});
//var path = require('path')
//const DIR = './static/images';
// let storage = multer.diskStorage({
//    destination: function (req, file, callback) {
//       callback(null, DIR);
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
//let upload = multer({storage: storage});
app.post('/add_job', upload.single('pic'),isLoggedIn, function (req, res) {

    //console.log(req.body);
    //console.log(req.file);
    //console.log(req.files);

    //   var pic = req.file.filename ;
    var roll = req.body.roll;
    var name = req.body.name;
    var batch = req.body.batch;
    var branch = req.body.branch;
    var working_at = req.body.working_at;
    var reach_out = req.body.reach_out;

    //var path = "./static/images"+ req.body.pic;

    fs.readFile(req.file.path, (err, data) => {
        //console.log(data);

        pool.query('insert into jobs(pic,roll,name,batch,branch,working_at,reach_out) values(?,?,?,?,?,?,?)', [data, roll, name, batch, branch, working_at, reach_out], function (error, results, fields) {
            if (error) console.log(error);
            res.redirect('/jobs');
        });
    });
});

app.get('/remove_job', isLoggedIn, (req, res) => {

    res.render('./remove_job.ejs');
});

app.post('/remove_job',isLoggedIn, function (req, res) {
    var roll = req.body.roll;
    pool.query('delete from jobs where roll=' + roll + '', function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/jobs');
    });
});




app.get('/jobs',isLoggedIn, (req, res) => {
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






var year;
app.post('/batch',isLoggedIn, function (request, response) {
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
    }
    // else {
    // 	response.send('Please enter year');
    // 	response.end();
    // }
});

app.post('/batch', isLoggedIn, function (req, res) {
    //var type = req.body.update_batch.toLowerCase();
    var type = './' + req.body.update_batch.toLowerCase() + '.ejs';
    console.log(type);
    return res.render(type);



    // if (type === "REMOVE_BATCH") {
    //     res.render('/remove_batch');
    // } else if (type === "ADD_BATCH") {
    //     res.render('/add_batch');
    // }
});
app.get('/add_batch', isLoggedIn, (req, res) => {
    res.render('./add_batch.ejs');
});
//var path = require('path')
//const DIR = './static/images';
// let storage = multer.diskStorage({
//    destination: function (req, file, callback) {
//       callback(null, DIR);
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
//let upload = multer({storage: storage});
app.post('/add_batch', upload.single('pic'),isLoggedIn, function (req, res) {

    //console.log(req.body);
    //console.log(req.file);
    //console.log(req.files);

    //   var pic = req.file.filename ;
    var roll = req.body.roll;
    var name = req.body.name;
    var year = req.body.year;
    var branch = req.body.branch;
    var reach_out = req.body.reach_out;

    //var path = "./static/images"+ req.body.pic;

    fs.readFile(req.file.path, (err, data) => {
        //console.log(data);

        pool.query('insert into batchwise(pic,roll,name,year,branch,reach_out) values(?,?,?,?,?,?)', [data, roll, name, year, branch, reach_out], function (error, results, fields) {
            if (error) {
                console.log(error);
                return;
            }
            let present = false;
            pool.query('select * batch(year) values(?)', [year], function (error, results, fields) {
                if (error) {

                    return;
                }
                if (results) {
                    present = true;
                }
            });

            if (!present) {

                pool.query('INSERT INTO batch(year) values(?)', [year], function (error, results, fields) {
                    if (error) {
                        pool.query('delete from batchwise(pic,roll,name,year,branch,reach_out) values(?,?,?,?,?,?)', [data, roll, name, year, branch, reach_out])
                        return;
                    }
                });
            }
            return res.redirect('/batch');

        });
    });
});

app.get('/remove_batch', isLoggedIn, (req, res) => {

    res.render('./remove_batch.ejs');
});

app.post('/remove_batch',isLoggedIn, function (req, res) {
    var roll = req.body.roll;
    pool.query('delete from batchwise where roll=' + roll + '', function (error, results, fields) {
        if (error) console.log(error);
        res.redirect('/batch');
    });
});



//app.get('/batchwise', isLoggedIn, (req, res) => {
//setResHtml("SELECT * FROM batchwise natural join listing natural join batchwise where batchwise.year=" + req.session.year, (responseData) => {
//res.render('./batchwise.ejs', { data: responseData });
//});
//});
app.get('/batchwise',isLoggedIn, (req, res) => {
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









function isLoggedIn(req, res, next) {
    console.log(req.session.loggedin);
    if (req.session.loggedin) {
        return next();
    }
    res.send("Not Logged In");
}



app.listen(7000, () => {
    console.log("Connected to 7000");
});
