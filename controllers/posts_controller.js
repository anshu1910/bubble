const Post = require('../models/post');
const Comment = require('../models/comment')
module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id
    });
    // Handle successful creation
    return res.redirect('back');
  } catch (err) {
    // Handle error
    console.error('Error in posting:', err);
    return res.status(500).send('Error in posting');
  }
};

//const { Post, Comment } = require('../models'); // Assuming Post and Comment are Mongoose models

module.exports.destroy = async function(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.user.equals(req.user._id)) {
      await Post.deleteOne({ _id: req.params.id }); // Delete the post
      await Comment.deleteMany({ post: req.params.id }); // Delete associated comments
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    console.error('Error deleting post:', err);
    return res.status(500).send('Error deleting post');
  }
};

