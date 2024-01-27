// Required Necessory Packages
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");

const listings=require("./routes/listing.js");
const review=require("./routes/review.js");

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


app.use("/listings",listings)
app.use("/listings/:id/review",review);


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

