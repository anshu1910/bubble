const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post)
        .then(post => {
            if (!post) {
                console.log('Post not found');
                return res.status(404).send('Post not found');
            }

            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            })
            .then(comment => {
                post.comments.push(comment);
                return post.save();
            })
            .then(() => {
                res.redirect('/');
            })
            .catch(err => {
                console.error('Error in creating comment:', err);
                res.status(500).send('Error creating comment');
            });
        })
        .catch(err => {
            console.error('Error finding post:', err);
            res.status(500).send('Error finding post');
        });
};

module.exports.destroy = function(req, res){
    Comment.findById(req.params.id)
        .exec()
        .then(comment => {
            if (comment.user == req.user.id) {
                let postId = comment.post;
                return comment.deleteOne()
                    .then(() => {
                        return Post.findByIdAndUpdate(postId, { $pull: { comment: req.params.id }})
                            .exec();
                    })
                    .then(() => {
                        return res.redirect('back');
                    })
                    .catch(err => {
                        console.log('Error deleting comment:', err);
                        return res.redirect('back');
                    });
            } else {
                return res.redirect('back');
            }
        })
        .catch(err => {
            console.log('Error finding comment:', err);
            return res.redirect('back');
        });
}
 