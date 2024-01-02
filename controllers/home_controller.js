const Post = require('../models/post'); // Assuming Post is a Mongoose model

module.exports.home = function(req, res) {
  Post.find({})
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    .exec()
    .then(posts => {
      return res.render('home', {
        title: "Bubble|Home",
        posts: posts
      });
    })
    .catch(err => {
      console.error("Error fetching posts:", err);
      return res.status(500).send("Error fetching posts"); // Sending an error response to the client
    });
};
