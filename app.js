// Required Necessory Packages
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStartegy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
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

const sessionOptions={
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStartegy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curUsr=req.user;
    next();
});

app.use("/listings",listingRouter)
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

// Root Route
app.get("/",(req,res)=>{
    res.send("I am Root");
});

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!!!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,msg="Something went Wrong!"}=err;
    res.status(statusCode).render("listings/error.ejs",{msg});
    next();
});



//establish Server Connection
app.listen(8080,()=>{
    console.log("Server is listening on port 8080");
});

