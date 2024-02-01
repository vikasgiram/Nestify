const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
    .get(listingController.index)
    .post(isLoggedIn,upload.single("Listing[image{url}]"),validateListing,wrapAsync(listingController.newListing));


//get route for New Listing 
router.get("/new",isLoggedIn,listingController.newListingForm);

router.route("/:id")
    .get(listingController.showListing)
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
    .put(isLoggedIn, isOwner,upload.single("Listing[image{url}]"),validateListing,wrapAsync(listingController.updateListing));


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.editListingForm);


module.exports=router;