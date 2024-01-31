const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl, isLoggedIn}=require("../middleware.js");
const userController=require("../controller/user.js");

router.get("/signup",userController.signupForm);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.loginForm);

router.post("/login",redirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash:true}),userController.login);

router.get("/logout",userController.logout);

module.exports=router;