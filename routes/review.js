const express = require('express');
const router = express.Router({ mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js'); // wrapAsync is a utility function to handle async errors in express routes
const Listing = require('../models/listing.js');
const{ validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js'); // import the validateReview middleware for review validation
const Review = require('../models/review.js'); // import the Review model
const ExpressError = require('../utils/ExpressError.js'); // ExpressError is a custom error class to handle errors in express routes
const reviewController = require('../controllers/reviews.js')

// validate review server side validation

//post review route
router.post("/:id/reviews", isLoggedIn, wrapAsync(reviewController.createReview));

// delete route
router.delete("/:id/reviews/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports =router;