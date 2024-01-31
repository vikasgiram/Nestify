const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");



// Main All Listing Route
router.get("/",listingController.index);

//get route for New Listing 
router.get("/new",isLoggedIn,listingController.newListingForm);

// Show Route
router.get("/:id",listingController.showListing);

// Post Route for new Listing changes in DB
router.post("/",isLoggedIn, validateListing,wrapAsync(listingController.newListing));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// Update Route
router.put("/:id",isLoggedIn, isOwner,validateListing,wrapAsync(listingController.updateListing));



// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.editListingForm);


module.exports=router;