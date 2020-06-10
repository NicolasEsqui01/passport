var express = require('express');
var router = express.Router();
const passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register',(req, res, next) =>{
  res.render('register',{ title:'Express'})
});

router.get('/login', (req, res, next) => {
  res.render('login',{ title : 'Express'})
});

const isLogedin = (req, res, next) =>{
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/private', isLogedin , (req, res, next) =>{
  res.render('private' , { title : 'Express Private' })
});

router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback',passport.authenticate('facebook', { 
  successRedirect: '/',
  failureRedirect: '/login' 
}));

module.exports = router;
