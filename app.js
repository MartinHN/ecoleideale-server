const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = Promise;//require('bluebird');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

const WS = require('./WS_API/index')
const cfg = require('./config.js')
//connect to MongoDB

mongoose.connect(cfg.mongodb_url,{
  promiseLibrary: Promise//require('bluebird')
});
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});
// console.log(WS)
WS.startServer();


// safety concern
app.disable('x-powered-by')

// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
if(cfg.useLocalCors){
  app.use(function(req, res, next) {
    if( cfg.CORSList.indexOf(req.headers.origin)<0){
      console.error('refuse preflight', cfg.CORSList,req.headers.origin)
      res.sendStatus(405);
      return;
    }
    else{
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Credentials',true);
      

      
    }
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'access-control-allow-origin, access-control-allow-credentials');
      res.sendStatus(200);
    }
    else{
      next();
    }
  }
  );
}

//use sessions for tracking logins
var sph = 'doubl3bac0n'
app.use(session({
  secret: sph,
  resave: false,
  saveUninitialized: true,
  maxAge:1000*60*60*2,

  store: new MongoStore({
    mongooseConnection: db
  }),
  cookie:{
   secure: false ,
   maxAge:1000*60*60*2,
 }
}));





// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



// use passeport middleware
app.use(passport.initialize());
app.use(passport.session());
// include routes
var userRoutes = require('./routes/user');
var forumRoutes = require('./routes/forum');
var mainSiteRoutes = require('./routes/mainSite').router;
const voteRoutes = require('./routes/vote');
app.use('/api/user',  userRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/vote',  voteRoutes)
app.use('/',          mainSiteRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.error('404 err',req)
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  console.error('fb err',err)
  res.status(err.status || 500);
  res.send(err.message);
});


// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});