const express = require('express');
const router = express.Router();
const User = require('../models/user.js'); // import the user model
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport'); // import passport for authentication
const { saveRedirectUrl } = require('../middleware.js'); // import the middleware to save redirect URL

const userController = require('../controllers/user');

 // router.route("/path") implemented
 
router
    .route("/signup")
    .get(userController.signup )
    .post(wrapAsync(userController.renderSignup));

router
    .route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: '/login' , failureFlash: true}), userController.login);


router.get("/logout", userController.logout);

module.exports = router;
   