var express = require('express');
var router = express.Router();
const User = require('../models/index');
const passport= require('passport')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', (req, res, next) =>{
    return User.create({
      email:req.body.username,
      password:req.body.password
    })
      .then(()=>{
        res.redirect('/login')
      })
      .catch(next)
});

router.post('/login' , passport.authenticate('local') , (req, res, next)=>{
    res.redirect('/private');
});

router.post('/logout', (req, res, next) =>{
  if(req.isAuthenticated()){
    req.logOut()
    res.redirect('/login')
  }else{
    res.redirect('/')
  }
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



module.exports = router;
