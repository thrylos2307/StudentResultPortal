
const passportLocal = require('./config/passport_local');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const app2 = express();
const session = require('express-session');
const passport = require('passport');
const port = 8000;
const MySQLStore = require('express-mysql-session')(session);
const customMware = require('./config/middleware');
const path = require('path');
var expressLayouts = require('express-ejs-layouts');
var router = express.Router()
app2.set('view engine', 'ejs');

app2.set('layout extractScripts', true);
app2.use(expressLayouts);
app2.use(express.static(path.join(__dirname, 'static')));
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });
app2.use(cors());
app2.use(urlencodedParser);
app2.use(session({
  secret: 'secret_session',
  resave: false,
  rolling: true,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 10 }
}));


app2.use(passport.initialize());
app2.use(passport.session());
app2.use(passport.setAuthenticatedUser);

const con = require('./privacy');

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to sql");
});


app2.use(flash());
app2.use(customMware.setFlash);

app2.use('/', require('./routes'));

app2.listen(port, () => {
  console.log(`server is up at ${port}`);
  return;
})

