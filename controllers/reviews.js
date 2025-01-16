const Listing = require("../models/listing");
const Review =  require("../models/review");


module.exports.createReview =async(req , res) =>{
  console.log("Request body:", req.body);
    let listing = await Listing.findById(req.params.id);
    if (!req.body.review || !req.body.review.rating) {
      req.flash("error", "Rating is required");
      return res.redirect(`/listings/${listing._id}`);
  }
    let newReview = new Review({
      comment : req.body.review.comment,
      rating : Number(req.body.review.rating)
    });
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created!")
  res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async (req , res)=>{
    let {id , reviewId } = req.params;

    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , " Review Deleted!")
    res.redirect(`/listings/${id}`);
}