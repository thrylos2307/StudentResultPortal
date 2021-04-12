const express = require('express');
const app = express();
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
app.set('view engine', 'ejs');
app.use(expressLayouts);
//extraxt style and scripts from subpages into the layout
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.static('assets'));
//body-parser
app.use(express.urlencoded());
app.use(
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
//passort setup
app.use(passport.initialize());
app.use(passport.session());
//telling app to use flash
app.use(flash());
//middleware_filename.functionName
app.use(customMware.setFlash);
app.use(function (req, res, next) {
  if(req.session.uid !== undefined){
    console.log(req.session.uid)
  res.locals.loggedIn = req.session.uid;
  } else{
  res.locals.loggedIn = null;
  }
  next()
  })
app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`server is up at ${port}`);
  return;
});

//verify->stage1->stage2