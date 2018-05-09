var mongoose = require('mongoose');
// var bcrypt = require('bcrypt');

var ForumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  related_proposition:{
    type: String,
    required: true,

  },

  tags: [{
    type: String
  }],

  content: {
    type: String,
    required: true,
  },
  author:{
    type:String,
    required:true,
  }
});

// ForumSchema.statics.postTitles = []
ForumSchema.statics.getAllPostsIds= function (callback) {
  var postIds = []
  ForumPosts.find({} , (err, posts) => {
    if(err) { console.log("error while getting all posts")}
      else { 
        for(var i in posts){
          var post = posts[i]
          postIds.push(post._id);
        }
      }
      callback(postIds)
    })
}

ForumSchema.statics.getAllPostsTitles= function (callback) {
  var postTitles = []
  ForumPosts.find({} , (err, posts) => {
    if(err) { console.log("error while getting all posts")}
      else { 
        for(const post of posts){
          postTitles.push(post.title);
        }
      }
      callback(postTitles)
    })
}

ForumSchema.statics.getForTitle =function (t,callback) {
  var post=null;
  ForumPosts.find({title:t} , (err, posts) => {
    console.log('for title : ',posts)
    if(err) { console.error("error while getting post")}
      else if (posts.length){
        post = posts[0]
        callback(post)
      }
    })
}

ForumSchema.statics.getForId =function (id,callback) {
  var post=null;
  ForumPosts.findById(id, (err, fpost) => {
    console.log('for title : ',fpost)
    if(err) { console.error("error while getting post")}
      else {
        post = fpost
        callback(post)
      }
    })
}

ForumSchema.statics.addPost = function(p,successcb,errcb){
  console.log("adding ",p)
  var postData = {
    title: p.title,
    content: p.content,
    tags: p.tags,
    author: p.author
  }

  ForumPosts.create(postData, function (error, post) {
    if (error) {if(errcb)errcb(error);}
    else {
      if(successcb)successcb();
    }
  }
  );
}
var ForumPosts = mongoose.model('ForumEntry', ForumSchema);
module.exports = ForumPosts;

