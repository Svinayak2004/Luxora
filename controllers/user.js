const User = require('../models/user');

module.exports.signup = (req, res)=>{
    res.render("user/signup.ejs");
};

module.exports.renderSignup = async(req, res)=>{
   try{
    let {username, email, password} = req.body;
    let newUser = new User({email, username});
    await User.register(newUser, password);
    req.login(newUser, (err)=>{
        if(err){
            return next(err); 
        }
        req.flash("success", "Welcome to Luxora!");
        res.redirect('/listings');
    });
   } catch(err) {
       console.error(err);
       req.flash("error", "Something went wrong. Please try again.");
       res.redirect('/signup');
   }
};

module.exports.renderLogin =  (req, res)=>{
    res.render("user/login.ejs");
};

module.exports.login = async(req, res)=>{
    req.flash("success", "Welcome back to Luxora!");
    res.redirect(res.locals.redirectURL || '/listings'); // redirect to the original URL or listings page
};

module.exports.logout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            console.error(err);
            req.flash("error", "Something went wrong while logging out.");
            return res.redirect('/listings');
        }
        req.flash("success", "Logged out successfully!");
        res.redirect('/listings');
    });
};

