const express = require('express');
const router = express.Router();
const Vote = require('../models/vote');
const mainSite = require('./mainSite')
const cfg = require('../config')


router.post('/doVote', (req,res,next)=>{

  const vote = req.body;
  vote['session_id'] = req.sessionID
  vote['proposition_id']=vote['id']
    // console.log("survey do vote",vote);
    Vote.addVote(vote,()=>{
      console.log('added');
        // res.end();
        res.json({success:true});
      },
      ()=>{
        res.json({success:false,servermsg:"can't vote"});
      });
  });

router.get('*', (req,res,next)=>{
  console.log("survey fallback",req.url);
  res.json({servermsg:"address not found"});

});

module.exports = router;