const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl, isLoggedIn}=require("../middleware.js");
const userController=require("../controller/user.js");


router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.loginForm)
    .post(redirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}),userController.login)

router.route("/logout")
    .get(userController.logout);

module.exports=router;