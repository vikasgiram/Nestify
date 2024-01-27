const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");
const Listing=require("../models/listings.js");


const validateListing=(req,res,next)=>{
    if(listingSchema){
        let {error}=listingSchema.validate(req.body,{abortEarly:false});
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(", ");
            console.log(errMsg);
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
    }
    else
        console.log("Listing Schema is not defined");
}

// Main All Listing Route
router.get("/",async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
});

// New Listing Route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id",async (req,res)=>{
    let { id }=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
});

// Post Route for save changes in DB
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    let listing= new Listing(req.body.Listing);
    await listing.save();   
    res.redirect("listings/");
}));

// Delete Route
router.delete("/:id",wrapAsync(async (req,res,next)=>{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("listings/");
}));


// Update Route
router.put("/:id",validateListing,wrapAsync(async (req,res,next)=>{

    let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`listings/${id}`);
}));



// Edit Route
router.get("/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
});


module.exports=router;