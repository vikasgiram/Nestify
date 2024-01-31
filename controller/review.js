const Review=require("../models/review");
const Listing=require("../models/listings");

module.exports.newListingReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${req.params.id}`)
};

module.exports.destoryReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};

