
const express = require('express');
const app1 = express();
const port = 5000;
const env = require('./config/environment')
const db = require('./config/mongoose');
const session = require('express-session');
const  passport = require('passport');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const flash=require('connect-flash');
const customMware=require('./config/middleware');
var expressLayouts = require('express-ejs-layouts');
app1.set('view engine', 'ejs');
app1.use(expressLayouts);
//extraxt style and scripts from subpages into the layout
app1.set('layout extractStyles',true);
app1.set('layout extractScripts',true);

app1.use(express.static('assets'));
//body-parser
app1.use(express.urlencoded());
app1.use(
  session({
    name: env.session_name,
    secret: env.secret,
    resave: true,
    cookie: {
      maxAge: (1000 * 60  * 10)
    },
    store: new MongoStore({
      mongooseConnection: db,
      autoRemove: 'disabled'
    },
    function(err){
      console.log(err || 'connect-mongodb setup ok');
    }),
    saveUninitialized: true,
    // clears all expired sessions after 10 min
    clear_interval: 600
  })
);
//adding production
//passort setup
app1.use(passport.initialize());
app1.use(passport.session());
//telling app1 to use flash
app1.use(flash());
//middleware_filename.functionName
app1.use(customMware.setFlash);
app1.use(function (req, res, next) {
  if(req.session.uid !== undefined){
    console.log(req.session.uid)
  res.locals.loggedIn = req.session.uid;
  } else{
  res.locals.loggedIn = null;
  }
  next()
  })
app1.use('/', require('./routes'));

app1.listen( port, () => {
  console.log(`server is up at ${port}`);
  return;
});
// module.exports=app1;
//verify->stage1->stage2