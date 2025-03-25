const express=require("express");
const router=express.Router();
const passport=require("passport");


const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../utils/loginAuthentication");

//importing related async functions from controller folder
const userController = require("../controllers/users");


//routes related to signup
router.route("/signup")
    //registering the user in the databasee
    .post(wrapAsync(userController.registerUser));



//routes related to login
router.route("/login")

    //getting the login form
    .get(userController.renderLoginForm)

    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(userController.loginUser));


//logout route
router.get("/logout", userController.logoutUser);


module.exports = router;