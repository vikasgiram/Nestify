const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review= require("../models/review.js");
const Listing=require("../models/listings.js");
const {reviewSchema}=require("../schema.js");


const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


//Post Route for Review
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let review = new Review(req.body.review);

    listing.reviews.push(review);
    await listing.save();
    await review.save();
    res.redirect(`/listings/${req.params.id}`)
}));


// Delete route for review
router.delete("/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


module.exports=router;