const User = require('../models/user');

module.exports.profile = async function(req, res){
    try {
        if(req.cookies.user_id){
            const user = await User.findById(req.cookies.user_id).exec();
            
            if(user){
                return res.render('user-profile', {
                    title: "User Profile",
                    user: user
                });
            } else {
                return res.redirect('/users/sign-in');
            }
        } else {
            return res.redirect('/users/sign-in');
        }
    } catch (err) {
        console.log('Error fetching user profile:', err);
        return res.status(500).send('Internal Server Error');
    }
}


module.exports.signUp = function(req, res){
    return res.render('user-sign-up', {
        title: "Bubble | Sign Up"
    });
}

module.exports.signIn = function(req, res){
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

//const User = require('../models/user');

module.exports.createSession = async function(req, res){
    try {
        const foundUser = await User.findOne({ email: req.body.email }).exec();

        if(foundUser){
            if(foundUser.password !== req.body.password){
                return res.redirect('back');
            }
            res.cookie('user_id', foundUser.id);
            return res.redirect('/users/profile');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in signing in:', err);
        return res.status(500).send('Internal Server Error');
    }
}

module.exports.signOut = function(req, res) {
    // Clear the user's session-related data
    res.clearCookie('user_id'); // Assuming the user_id is stored in a cookie

    // Redirect the user to a suitable page after sign-out
    return res.redirect('/users/sign-in'); // Redirect to sign-in page or any other page
};