const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const Review= require("../models/review.js");
const Listing=require("../models/listings.js");
const reviewController=require("../controller/review.js");


//Post Route for Review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.newListingReview));


// Delete route for review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destoryReview));


module.exports=router;