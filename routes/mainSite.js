const express = require('express');
const router = express.Router();
var expressStaticGzip = require("express-static-gzip");

// const domain="http://localhost:8080";
const staticFiles = "public/"
const errorPageURL = "/#/notfound"
const indexPage = "index.html"

let staticOptions = {
  dotfiles: 'ignore',
  etag: false,
  index: indexPage,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  },
  fallthrough: true
}


const cfg={
  staticFiles
}

// GET route for reading data
router.get('*', (req,res,next)=>{
  console.log("serving",req.url);
  next();
});

// for static assets



 
router.get('*', expressStaticGzip(cfg.staticFiles));
router.get('*', (req,res,next)=>{
  console.log("failed gzip :"+req.url);
  next();
});
router.get('*', express.static(cfg.staticFiles,staticOptions));

// for site URL
router.get('*', (req,res,next)=>{
  res.sendFile(indexPage,{root:staticFiles});
});

// fallback (never used...)
router.get('*', (req,res,next)=>{
  console.log("fall back")
  res.redirect(errorPageURL);
});



module.exports=  {
  cfg:cfg,
  router:router
}