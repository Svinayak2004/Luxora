const Review = require('../models/review.js');
const Listing = require('../models/listing.js')

module.exports.createReview = async(req, res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id; // associate the review with the logged-in user
  
  listing.reviews.push(newReview);
  console.log(newReview);
  await newReview.save();
  await listing.save();
 
  req.flash("success","review created!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async(req, res, )=>{
  let {id, reviewId}= req.params;

  
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); //remove id from listing using $pull operator 
  await Review.findByIdAndDelete(reviewId);

  req.flash("success","review deleted !");
  res.redirect(`/listings/${id}`);

};