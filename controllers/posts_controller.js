const Post = require('../models/post');

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
