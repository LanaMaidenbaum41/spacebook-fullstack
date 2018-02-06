var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");

  //render all the posts that are in the database
  getData();

  function _renderPosts() {
    console.log('Yo render')
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      //console.log('Loopin');
      var newHTML = template(posts[i]);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.post({
      url: '/posts',
      data: { text: newPost },
      dataType: 'json',
      success: function (data) {
        //console.log("post was saved");
        //console.log(data);
        posts.push(data);
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  }


  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (index) {
    var id = $('.post').eq(index).data().id;
    $.ajax({
      url: '/posts/'+ id,
      type: 'DELETE',
      success: function (data) {
        //console.log("deleted post");
        posts.splice(index, 1);
        _renderPosts();

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var addComment = function (newComment, postIndex) {
    var id = $('.post').eq(postIndex).data().id;
    $.post({
      url: '/posts/' + id + '/comments',
      data: newComment,
      dataType: 'json',
      success: function (data) {
        console.log(data);
        
        posts[postIndex] = data; 
        _renderComments(postIndex);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };

  var deleteComment = function (postIndex, commentIndex) {
    var id = $('.post').eq(postIndex).data().id;
    var commentId = posts[postIndex].comments[commentIndex]._id;
    $.ajax({
      url: '/posts/'+ id + '/comments/' + commentId,
      type: 'DELETE',
      success: function (data) {
        //console.log("deleted comment");
        posts[postIndex].comments.splice(commentIndex, 1);
        _renderComments(postIndex);

      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  
  };

  /*====Use spacebookDB in mongoDB to turn into fullstack app======= */
  function getData() {
    $.get({
      url: '/posts',
      success: function (data) {
        //put the db posts into the posts array of the app
        console.log(data);
        var counter = 0;
        posts = data;
        _renderPosts();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
      }
    });
  };


  return {
    addPost: addPost,
    removePost: removePost,
    addComment: addComment,
    deleteComment: deleteComment,
  };
};

var app = SpacebookApp();


$('#addpost').on('click', function () {

  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this).closest('.post').index();
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});


