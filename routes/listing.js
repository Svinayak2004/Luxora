const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js'); // wrapAsync is a utility function to handle async errors in express routes
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js'); // isLoggedIn is a middleware function to check if the user is logged in
const listingController = require('../controllers/listings.js'); // import the listing controllers
const multer = require("multer");
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });


// index route
router
    .route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing))   

// new route
router.get('/new',isLoggedIn,  listingController.renderNewForm);
    
// show route
router
    .route('/:id')
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner, upload.single("listing[image]"),wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

// edit route
router.get('/:id/edit', isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;
