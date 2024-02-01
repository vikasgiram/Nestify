const Listing=require("../models/listings");

module.exports.index=async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
};

module.exports.newListingForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let { id }=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        console.log("Listing not found");
        console.log(listing);
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");  
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.newListing=async (req,res,next)=>{
    let listing= new Listing(req.body.Listing);
    listing.owner=req.user._id;
    listing.image.url=req.file.path;
    listing.image.filename=req.file.filename;
    await listing.save();   
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.destroyListing=async (req,res,next)=>{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Sucessfully");
    res.redirect("/listings");
};

module.exports.updateListing=async (req,res,next)=>{
    let { id }=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    if(typeof req.file!=="undefined"){
        listing.image.url=req.file.path;
        listing.image.filename=req.file.filename;
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.editListingForm=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
};