const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review= require("../models/review.js");
const Listing=require("../models/listings.js");



//Post Route for Review
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author=req.user._id;
    listing.reviews.push(review);
    await listing.save();
    await review.save();
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${req.params.id}`)
}));


// Delete route for review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}));


module.exports=router;