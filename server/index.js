
const passportLocal = require('./config/passport_local');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const app = express();
const session = require('express-session');
const passport = require('passport');
const port = 5000;
const MySQLStore = require('express-mysql-session')(session);
const customMware = require('./config/middleware');
const path = require('path');
var expressLayouts = require('express-ejs-layouts');
var router = express.Router()
app.set('view engine', 'ejs');

app.set('layout extractScripts', true);
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'static')));
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(cors());
app.use(urlencodedParser);
app.use(session({
  secret: 'secret_session',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 10 }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

const con = require('./privacy');

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to sql");
});


app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));

app.listen(port, () => {
  console.log(`server is up at ${port}`);
  return;
})

