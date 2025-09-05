const Listing = require('../models/listing');

module.exports.index = (async(req,res)=>{
    const allListings = await Listing.find({})
    res.render('listings/index',{allListings});
});

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:'reviews',
      populate:{path:'author'}
    })
    .populate('owner');

    if(!listing){
      req.flash("error","Listing you trying for does not exist");
      return res.redirect("/listings");  
    }
    res.render('listings/show.ejs',{listing});
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }; 
    await newListing.save();
    // req.flash is used to store flash messages in the session
    req.flash("success","new listing created!");
    res.redirect('/listings');
};

module.exports.renderEditForm = async(req,res,next)=>{
  let {id} = req.params;
  id = id.trim();
  const listing =await Listing.findById(id);

  if(!listing){
      req.flash("error","Listing you trying for does not exist");
      return res.redirect("/listings");  
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render('listings/edit.ejs',{listing , originalImageUrl});
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (typeof req.file !== "undefined") {
      const { url, filename } = req.file;
      listing.image = { url, filename };
      await listing.save(); // to trigger pre-save middleware if any
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err); // pass errors to error handler
  }
};


module.exports.deleteListing = async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success","listing deleted!");

  res.redirect('/listings');
}