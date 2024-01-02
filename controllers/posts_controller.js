const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id
    });
    // Handle successful creation
    req.flash('success', 'Post published');
    return res.redirect('back');
  } catch (err) {
    // Handle error
    req.flash('error', err)
    return res.redirect('back');
  }
};

module.exports.destroy = async function(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.user.equals(req.user._id)) {
      await Post.deleteOne({ _id: req.params.id }); // Delete the post
      await Comment.deleteMany({ post: req.params.id }); // Delete associated comments
      req.flash('success','Post and associated comments deleted' );
      return res.redirect('back');
    } else {
      req.flash('error','You cannot delete this post' );
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err)
    return res.redirect('back');
  }
};

