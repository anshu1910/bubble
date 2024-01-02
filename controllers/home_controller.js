const Post = require('../models/post');
const User = require('../models/user');

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
      User.find({}) // Remove the callback function
        .then(users => {
          return res.render('home', {
            title: "Bubble|Home",
            posts: posts,
            all_users: users
          });
        })
        .catch(userErr => {
          console.error("Error fetching users:", userErr);
          return res.status(500).send("Error fetching users");
        });
    })
    .catch(err => {
      console.error("Error fetching posts:", err);
      return res.status(500).send("Error fetching posts");
    });
};
