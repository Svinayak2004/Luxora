const Listing = require('./models/listing');
const { listingSchema, reviewSchema} = require('./schema.js'); // import the listing schema for validation
const ExpressError =require('./utils/ExpressError.js'); // ExpressError is a custom error class to handle errors in express routes
const Review = require('./models/review.js'); // import the Review model

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl; // store the original URL to redirect after login
        req.flash("error","You must be logged in to access this page");
        return res.redirect('/login');
    }
    next();     
}


module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL
    }
    next();
};

module.exports.isOwner = async(req, res, next) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentuser._id)){
        req.flash("error","You do not have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req , res , next) =>{
  let {error} = listingSchema.validate(req.body);
  
  if (error){
    let errmsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errmsg);
  }
  else{
    next();
  }
}

module.exports.validateReview = (req, res, next)=>{
  let {error}= reviewSchema.validate(req.body);
  if (error){
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currentuser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};