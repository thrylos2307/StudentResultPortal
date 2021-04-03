const express = require('express');
const app = express();
const port = 5000;
const env = require('./config/environment')
const db = require('./config/mongoose');
const session = require('express-session');
const  passport = require('passport');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);
app.set('view engine', 'ejs');
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
app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`server is up at ${port}`);
  return;
});

//verify->stage1->stage2