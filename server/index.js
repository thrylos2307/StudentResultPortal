const passport=require('passport');
const passportLocal=require('./config/passport_local');
const express = require('express');
const bodyParser=require('body-parser');
const cors = require('cors');
const app = express();
const alert=require('alert');
const port = 5000;
const session = require('express-session');
const MySQLStore=require('express-mysql-session')(session);
const path=require('path');
app.set('view-engine','ejs');
app.use(express.static(path.join(__dirname, 'static')));
const jsonParser=bodyParser.json();
const urlencodedParser=bodyParser.urlencoded({ extended: true });
app.use('/css',express.static(__dirname+'/node_modules/bootstrap/dist/css'));
app.use(cors());
app.use(urlencodedParser);
app.use(session({
  secret: 'secret_session',
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge:600000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.listen(port, () => {
  console.log(`server is up at ${port}`);
  return;
})

const con=require('./privacy');

con.connect(function(err){
  if(err)throw err;
  console.log("Connected to sql");
});

  
app.use('/',require('./routes'));


// app.post("/create_faculty",(req,res)=>{
//      const id=req.body.id;
//      const name =req.body.name;
//      const email=req.body.Email;
//      const passw=req.body.password;
//      con.query("INSERT INTO faculty_login(Id,Name,Email,Password) values(?,?,?,?)",
//      [id,name,email,passw],
//      (err,result)=>{
//        if(err)console.log(err);
//        else{res.send("values inserted");} 
//      });
// });
// app.get("/faculty",(req,res)=>{
//   con.query("select *from faculty_login",(err,result)=>{
//     if(err)console.log(err);
//     else{res.send(result);console.log(result);}
//   });
// });