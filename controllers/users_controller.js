const User = require('../models/user');

module.exports.profile = function(req, res){
    User.findById(req.params.id)
        .then(user => {
            return res.render('user-profile', {
                title: 'User Profile',
                profile_user: user
            });
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            return res.status(500).send("Error fetching user");
        });
};

module.exports.update = function(req, res){
    if (req.user.id === req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body)
            .then(user => {
                return res.redirect('back');
            })
            .catch(err => {
                console.error('Error updating user:', err);
                return res.status(500).send('Internal Server Error');
            });
    } else {
        return res.status(401).send('Unauthorized');
    }
}


module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user-sign-up', {
        title: "Bubble | Sign Up"
    });
}

module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user-sign-in', {
        title: "Bubble | Sign In"
    });
}

module.exports.create = async function(req, res){
    // Validate password and confirm-password
    if(req.body.password !== req.body['confirm-password']) {
        return res.redirect('back');
    }

    try {
        const foundUser = await User.findOne({ email: req.body.email }).exec();

        if(!foundUser){
            const newUser = await User.create(req.body);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error:', err);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(function(err) {
        if (err) {
            // Handle error
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        // Successful logout
        return res.redirect('/');
    });
}