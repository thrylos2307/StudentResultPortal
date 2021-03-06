const con=require("../privacy.js");
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
console.log('Inside passport_local verify');
// authentication using passport
passport.use(new LocalStrategy(
    {
        usernameField: 'id',
        passReqToCallback: true
    },
    function(req, id, password, done)
    {
        // find a user and establish the identity
        con.query(`select * from Admin where Name='${id}' and Password='${password}'`,(err,user)=>{
            if(err)
            {
                //req.flash('error', err);
                return done(err);
            }
            console.log(user[0]);
            if(!user[0])
            {
               // req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }
            
            console.log(`${user[0].Name} signed in!`);
            return done(null, user[0]);
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done)
{   console.log('inside serialize');
    done(null, user.Name);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(user, done)
{   console.log('inside deserialize');
    con.query(`select * from Admin where Name='${user}'`,(err,users)=>{
          //return done(null, user);
        if(err)
        {
            console.log('Error in finding user --> Passport');
            return done(err);
        }
        console.log(users,user);
        return done(null, users[0]);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next)
{
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated())
    {   console.log('user fund ');
        return next();
    }
    console.log("user not signed in");
    // if the user is not signed in
    return res.redirect('/login');
}

passport.setAuthenticatedUser = function(req, res, next)
{   console.log(req.user,'A');
    if(req.isAuthenticated())
    {   console.log('saving user info');
        // req.user contains the current signed in user from the session cookie and we are just sending it to the local for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;