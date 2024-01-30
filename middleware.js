
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You're not login, Please login first");
        res.redirect("/login");
    }
    else{
        next();
    }
}