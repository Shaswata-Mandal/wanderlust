const express=require("express");
const router= express.Router();

//for handling files
const {storage} = require("../cloudConfig.js");
const multer=require("multer");
const upload= multer({storage});


//importing async wrap
const wrapAsync=require("../utils/wrapAsync");

//importing all the lisitng related async funtions from the controller folder
const listingController = require("../controllers/listings.js");

//importing all the necessary middlewares
const validateListing = require("../utils/validationMiddlewares.js").validateListing;
//getting the isLoggedAuthentication funtion and passing it as a middleware
const {isLoggedIn, isOwner} = require("../utils/loginAuthentication");


//-------------------------------------------------------------------------------------------------------------------------------------
//Creating different routes based on the functionalities----------------------------------------------------------

//0.1) api route for getting relevant search suggestions----------------------------------------------------------
router.get("/api/search-suggestions", wrapAsync(listingController.suggestionsApi));


//0.2) api route for getting listings related to search query----------------------------------------------------------
router.get("/api/search-listings", wrapAsync(listingController.listingSearchApi));


//1) route for getting all listings----------------------------------------------------------

router.get("/", listingController.renderAllListings);


//2.1) route for creating a new listing----------------------------------------------------------

router.get("/new", isLoggedIn, listingController.renderNewListingForm);

//2.2) create route
router.post(
    "/",
    isLoggedIn,
    upload.single('listing[imageFile]'),
    listingController.transferFileUrl,
    validateListing,
    wrapAsync(listingController.createNewListing)
);


//3) route for getting  detail of a particular listing----------------------------------------------------------

router.get("/:id", wrapAsync(listingController.renderParticularListing));

//4.1) route for editing  detail of a particular listing----------------------------------------------------------

router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm));

//4.2) update route
router.put(
    "/:id", 
    isLoggedIn, 
    isOwner, 
    upload.single('listing[imageFile]'), 
    listingController.transferFileUrl,
    validateListing, 
    wrapAsync(listingController.editListing)
);

//5) route for deleting  a particular listing----------------------------------------------------------
router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;