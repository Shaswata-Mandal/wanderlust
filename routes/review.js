const express=require("express");
const router= express.Router({mergeParams: true});

//importing async wrap
const wrapAsync=require("../utils/wrapAsync");


//importing all the async functions related to review from controller folder
const reviewController = require("../controllers/reviews");

//importing the required middlewares
const {isLoggedIn} = require("../utils/loginAuthentication");
const validateReview = require("../utils/validationMiddlewares").validateReview;


//-------------------------------------------------------------------------------------------------------------------------------------
//Creating different routes for handling reviews----------------------------------------------------------

//create review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


//delete review route
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroyReview));


module.exports = router;