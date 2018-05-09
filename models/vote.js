var mongoose = require('mongoose');


var VoteSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true
  },
  proposition_id:{
    type: String,
    required: true
  },
  rate:{
    type: String,
    required: true
  },

  remarks: {
    type: String,
    required: false,
  },

});


VoteSchema.statics.getAllVotesForSessionId= function (sid,callback) {
  var resp = []
  Votes.find({session_id:sid} , (err, votes) => {
    if(err) { console.log("error while getting all votes")}
      else { 
        resp = votes;
      }
      callback(resp)
    })
}

function validateVote(vote){
  const k = Object.keys(vote)
  return vote['session_id'] && vote['proposition_id']
}

VoteSchema.statics.addVote = function(v,successcb,errcb){

  if(validateVote(v)){
    const voteData = v
    console.log(voteData)
    const voteId  = {session_id:voteData.session_id,proposition_id:voteData.proposition_id}
    Votes.update(voteId,voteData,{upsert:true}, function (error, post) {
      if (error) {if(errcb)errcb(error);}
      else {if(successcb)successcb();}
    });
  }
  else{
    console.log('vote not valid')
  }
  
}
var Votes = mongoose.model('Votes', VoteSchema);
module.exports = Votes;

