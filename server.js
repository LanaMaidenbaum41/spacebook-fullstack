var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', { useMongoClient: true }, function () {
  console.log("DB connection established!!!");
})

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
  Post.find(function (err, result) {
    if (err) throw err;
    res.send(result);
  });
});


// 2) to handle adding a post
app.post('/posts', function (req, res) {
  var newPost = new Post({
    text: req.body.text
  });
  newPost.save(function (err, newPost) {
    if (err) {
      console.log(err);
    }
    else {
      //console.log("new post was saved!");
      res.send(newPost);
    }
  })

});
// 3) to handle deleting a post
app.delete('/posts/:id', function (req, res) {
  var id = req.params.id;
  Post.findByIdAndRemove(id, function (err, result) {
    if (err) throw err
    res.send(result);
  });

});
// 4) to handle adding a comment to a post
app.post('/posts/:id/comments', function (req, res) {
  var id = req.params.id;
  //find the post by id in db
  Post.findById(id, function (err, post) {
    if (err) throw err;
    //add the comment to the comment array with push
    post.comments.push({ text: req.body.text, user: req.body.user });
    post.save(function (err, newPost) {
      if (err) {
        console.log(err);
      }
      else {
        //console.log("comment was saved!");
        res.send(newPost);
      }
    });
  });

});
// 5) to handle deleting a comment from a post
app.delete('/posts/:id/comments/:commentId', function (req, res) {
  console.log('heyo')
  var id = req.params.id;
  var commentId = req.params.commentId;
  //find the post by id in db
  Post.findById(id, function (err, post) {
    if (err) throw err;
    for(var i = 0; i < post.comments.length; i ++){
      //console.log('comm id')
      //console.log(commentId)
      //console.log(post.comments[i]._id)
      if(commentId == post.comments[i]._id){

        console.log('-----------------before')
        console.log(post)
        post.comments.splice(i, 1)
        console.log('-----------------after')
        
        console.log(post)
        post.save()
        res.send(post)
      }
    }
    //send back the updated post
  
  });

  // Post.update(
  //   {_id: id}, //the post I want to update
  //   {$pull : {comments: {_id: commentId}}}, //grab out the specified comment
  //   function(err, updatedPost){   // callback
      
  //     res.send(updatedPost)
  //   }
  // )
});

app.listen(8000, function () {
  console.log("what do you want from me! get me on 8000 ;-)");
});


/*=====Create Dummy Data for posts collection - exectued twice====== */
// var dummyPost1 = new Post({
//   text: "Im dummy number 1"
// });
// dummyPost1.save(function (err, data) {
//   if (err) {
//     console.error(err);
//   } else {
//     //   console.log(data);
//   }
// });

// var dummyPost2 = new Post({
//   text: "Im dummy number 2"
// });
// dummyPost2.save(function (err, data) {
//   if (err) {
//     console.error(err);
//   } else {
//     //   console.log(data);
//   }
// });

// var dummyPost3 = new Post({
//   text: "Im dummy number 3"
// });
// dummyPost3.save(function (err, data) {
//   if (err) {
//     console.error(err);
//   } else {
//     //   console.log(data);
//   }
// });

// dummyPost1.comments.push({ text: "comment for post1", user: 'Lana' });
// dummyPost2.comments.push({ text: "comment for post2", user: 'Amitay' });
// dummyPost3.comments.push({ text: "comment for psot3", user: 'Daniel' });