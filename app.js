// Required Necessory Packages
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listings.js");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review= require("./models/review.js");

// Connecte to DB
main().then(()=>{
    console.log("Connected to DB Sucess");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

// Set Default Values
app.set("view eingine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);


// Root Route
app.get("/",(req,res)=>{
    res.send("I am Root");
});

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

// Main All Listing Route
app.get("/listings",async (req,res)=>{
    const listings=await Listing.find({});
    res.render("listings/index.ejs",{listings});
});

// New Listing Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Post Route for save changes in DB
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{
    let listing= new Listing(req.body.Listing);
    await listing.save();   
    res.redirect("/listings");
}));

// Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res,next)=>{
    let { id }=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// Update Route
app.put("/listings/:id",validateListing,wrapAsync(async (req,res,next)=>{

    let { id }=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.Listing});
    res.redirect(`/listings/${id}`);
}));

// Show Route
app.get("/listings/:id",async (req,res)=>{
    let { id }=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
});

// Edit Route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
});

//Post Route for Review
app.post("/listings/:id/review",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let review = new Review(req.body.review);

    listing.reviews.push(review);
    await listing.save();
    await review.save();
    res.redirect(`/listings/${req.params.id}`)
}));


// Delete route for review
app.delete("/listings/:id/review/:reviewId",wrapAsync(async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!!!"));
})

app.use((err,req,res,next)=>{
    console.log(err);
    let {statusCode=500,msg="Something went Wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{msg});
});


//establish Server Connection
app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});

