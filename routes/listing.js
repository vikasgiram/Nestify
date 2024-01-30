const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listings.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");



// Main All Listing Route
router.get("/",async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
});

//get route for New Listing 
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id",async (req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        console.log("Listing not found");
        console.log(listing);
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");  
    }
    res.render("listings/show.ejs",{listing});
});

// Post Route for new Listing changes in DB
router.post("/",isLoggedIn, validateListing,wrapAsync(async (req,res,next)=>{
    let listing= new Listing(req.body.Listing);
    listing.owner=req.user._id;
    await listing.save();   
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Sucessfully");
    res.redirect("/listings");
}));


// Update Route
router.put("/:id",isLoggedIn, isOwner,validateListing,wrapAsync(async (req,res,next)=>{
    let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));



// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
});


module.exports=router;