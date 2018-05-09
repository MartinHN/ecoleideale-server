const express = require('express');
const router = express.Router();
const Forum = require('../models/forum');
const User = require('../models/user');
const mainSite = require('./mainSite')
const cfg = require('../config')


const postExample = {
  title:"titleEx",
  content:"lalalal",
  tags:[]
}

const postListExample = {
  list:["titleEx","lala"]
}

router.get('/get', (req,res,next)=>{
  console.log("forum get req");
  console.log(req.query)
  var t = req.query.id
  if(t){
    // var _res = res;
    Forum.getForId(t,(o)=>{
      console.log('post : ',o);
      res.json(o);  
    });
  }
  else{
    console.log("no arguments in get");
  }
  

});



router.get('/list', (req,res,next)=>{
  console.log("forum list request");
  
  Forum.getAllPostsIds((l)=>{
    
    postListExample.list = l;
    console.log('list : ',postListExample.list);
    res.json(postListExample);
  });
});

router.post('/add', 
  (req,res,next)=>{
    console.log("forum add request");
    User.isLogged(req,(user)=>{
      
      var post = req.body;
      post.author=user.username;
      Forum.addPost(post,()=>{
        console.log('ended');
        // res.end();
        res.redirect('back');
      });
    },
    (err)=>{
      res.json({success:false,servermsg:'user not logged'})
    })
  }
  );

router.get('*', (req,res,next)=>{
  console.log("forum fallback",req.url);
  res.json(postExample);

});

module.exports = router;