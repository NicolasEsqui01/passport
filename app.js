const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const db = require('./config/db')
const User = require('./models/index')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
  secret:'cats',
  resave:true,
  saveUninitialized:true
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ where:{ email: username }})
      .then(user => {
        if(!user){
          return done(null, false , {message : 'usuario incorrecto'})
        }
        if(!user.validPassword(password)){
          return done(null, false, {message : 'contraseña incorrecta'})
        }
        return done(null,user)
      })
      .catch(done)
  }
));

// passport.use(new FacebookStrategy({
//   clientID: FACEBOOK_APP_ID,
//   clientSecret: FACEBOOK_APP_SECRET,
//   callbackURL: "http://www.example.com/auth/facebook/callback"
// },
// function(accessToken, refreshToken, profile, done) {
//   User.findOrCreate(..., function(err, user) {
//     if (err) { return done(err); }
//     done(null, user);
//   });
// }
// ));

//268832797674307 clave de inde
//cee79252d3bf3e8364907347a15f6464

passport.use(new FacebookStrategy(
    {
      clientID: '268832797674307' ,
      clientSecret: 'cee79252d3bf3e8364907347a15f6464',
      callbackURL: "http://localhost:1337/auth/facebook/callback",
      // profileFields: ["email"]
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({where:{ email : profile.displayName , password : profile.id}})
        .then((user) => done(null , user))
        .catch(done)
    }
  )
);

passport.serializeUser((user,done)=>{
  console.log(user)
  done(null, user)
});

passport.deserializeUser((id,done)=>{
  console.log(id)
  User.findByPk(id[0].id)
    .then((user)=>{
        done(null, user)
    })
    .catch(done)
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.sync({force:false})
  .then(()=>{
    app.listen(1337, ()=>{
      console.log('escuchando en el puerto 1337')
    })
  })
  .catch(err =>{
    console.log(err)
  })


module.exports = app;
