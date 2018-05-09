var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mainSite = require('./mainSite');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const cfg = require('../config')


passport.use(new LocalStrategy({
  usernameField: 'loginid',
  passwordField: 'logpass'
},
function(mail, password, done) {
  User.authenticate(mail, password, function (err, user) {
    if (err) { console.log("err",err);return done(err); }
    if (!user) { return done(null, false, { message: 'Incorrect username or pass.' });}
    else{done(null,user);}
  })
}));

passport.serializeUser(function(user, done) {
  if(user._id!==null)
    done(null, user._id);
  else{
    var err = new Error('no user id found');
    err.status = 400;
    done(err,null);
  }
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/ping',(req,res,next)=>{
  // setTimeout(()=>{
    res.json("ok");
// },1000)
}
)

//POST route for updating data
router.post('/', function (req, res, next) {

  if (req.body.email &&
    req.body.username &&
    req.body.pass ) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.pass,
    }

    User.create(userData, function (err, user) {
      if (err) {
        req.json({servermsg:err,success:false});
      } else {
        req.session.userId = user._id;
        res.redirect('/api/user/profile');
      }
      return  res.json({success:true,servermsg:'user created'});
      
    });

  }
  else if (req.body.loginid && req.body.logpass) {
    // console.log('aaaaaaa',req);
    var mail = req.body.loginid;
    passport.authenticate('local',
      function(err, user, info) {
        if (err) { return res.json({success:false,servermsg:'error :'+err}); }
        if (!user) { console.log('no user');return res.json({success:false,servermsg:'user not found'}); }
        req.logIn(user, function(err) {
          if (err) { return res.json({servermsg:'error :'+err}); }
          req.session.userId = user._id;
          return  res.json({success:true,servermsg:'user found',user:user});
        });
      })
    (req,res,next);
    
  } else {
    // var err = new Error('All fields required.');
    // err.status = 400;
    res.json({success:false,servermsg:'All fields required.'})

    return ;//next(err);
  }
})





// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      return next(error);
    } else {
      if (user === null) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
      } else {
        return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/api/user/logout">Logout</a>')
      }
    }
  });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
  else{
    console.warn('login out without session')
  }
});

module.exports = router;