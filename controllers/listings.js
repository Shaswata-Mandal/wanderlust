const Listing=require("../models/listing");


//1) for getting all listings----------------------------------------------------------
module.exports.renderAllListings = async (req, res)=>{
    let {category} = req.query;

    //if there is no category selected
    if(!category){
        const allListings = await Listing.find({}).populate("reviews");
        res.render("listings/index.ejs", { allListings });
    }

    else{
        let query = {};
        if (category) {
            query.categories = category;
        }

        // console.log("listing category api was called")

        const listings = await Listing.find(query).populate("reviews");
        
        if(category==="all"){
            const allListings = await Listing.find({}).populate("reviews");
            return res.json(allListings);
        }

        res.json(listings);
    }
  
};


//2.1) for rendering new listing form----------------------------------------------------------
module.exports.renderNewListingForm = (req, res)=>{
    res.render("listings/new.ejs");
};


//2.2) for creating a new listing----------------------------------------------------------
module.exports.createNewListing = async (req, res) => {

    // console.log(req.body.listing)

    if ((!req.file && !req.body.listing.imageUrl) && !req.body.listing.image) {
        req.flash("error", "You must upload an image or provide a image link!");
        return res.redirect("/listings/new");
    }

    //getting the url and filename of the image saved
    let url= req.body.listing.image.url;
    let filename= req.body.listing.image.filename;

    // Ensure categories are always an array (handle single category case)
    let categories = req.body.listing.categories;
    if (!Array.isArray(categories)) {
        categories = [categories]; // Convert to array if it's a single value
    }


    // Creating new listing with form data

    const newListing = new Listing({
        title: req.body.listing.title,
        description: req.body.listing.description,
        location: req.body.listing.location,
        country: req.body.listing.country,
        price: req.body.listing.price,
        owner: req.user._id,
        image: { url, filename },
        categories : categories,
    });

    

    await newListing.save();

    //creating a flash message
    req.flash("success", "New Listing was created");

    res.redirect("/listings");
};


//2.3) (middleware) for transfering the file url to the listing before validation----------------------------------------------------------
//cloudinary saves the file and returns the image url in req.file, so we need to save it in the listing before validation
module.exports.transferFileUrl = async (req, res, next) => {

    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (listing && listing.image.url) {
        req.body.listing.image = {
            url: listing.image.url,
            filename: listing.image.filename
        };
    }


    // ✅ Ensure image is included in req.body.listing before validation
    if (req.file) {
        // ✅ File uploaded → Use Cloudinary URL
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    } else if (req.body.listing.imageUrl && req.body.listing.imageUrl.trim() !== "") {
        // ✅ Image URL provided → Use the URL
        req.body.listing.image = {
            url: req.body.listing.imageUrl,
            filename: "external_url" // Mark as an external image
        };
    }


    else {
        // ❌ No image provided → Show error
        req.flash("error", "You must provide an image (either upload or URL).");
        return res.redirect("/listings");
    }

    next(); // Proceed to validation
}


//3) for getting  detail of a particular listing----------------------------------------------------------
module.exports.renderParticularListing = async (req, res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");

    //if a listing does not exists, show flash msg and redirect to all listings
    if(!listing){
        req.flash("error", "The listing you requested for does not exists!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", {listing})
};


//4.1) for rendering  edit form of a particular listing----------------------------------------------------------
module.exports.renderEditForm = async (req, res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);

    //if a listing does not exists, show flash msg and redirect to all listings
    if(!listing){
        req.flash("error", "The listing you requested for does not exists!");
        res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs", {listing});
};


//4.2) for editing a particular listing
module.exports.editListing = async (req, res) => {
    const { id } = req.params;
    const editDetails = req.body;

    // console.log(req.body.listing)
    
    if(!editDetails){
        throw new ExpressError(400, "Send edited listing details");
    }

    if ((!req.file && !req.body.listing.imageUrl) && !req.body.listing.image) {
        req.flash("error", "You must upload an image or provide a image link!");
        return res.redirect("/listings/new");
    }

    await Listing.findByIdAndUpdate(id, editDetails.listing);

    //creating a flash message
    req.flash("success", "Listing was edited");

    res.redirect(`/listings/${id}`);
};


//5) for deleting  a particular listing----------------------------------------------------------
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndDelete(id);

    //creating a flash message
    req.flash("success", "Listing was deleted");

    res.redirect("/listings");

};


//6) search suggestions api----------------------------------------------------------
module.exports.suggestionsApi = async(req, res)=>{
    const {q} = req.query;

    if(!q){
        return res.json([]);
    }

    const listings = await Listing.find({
        $or: [
            { location: new RegExp(q, "i") },  // Matches city (location) case-insensitively
            { country: new RegExp(q, "i") },   // Matches country case-insensitively
            { categories: { $elemMatch: { $regex: q, $options: "i" } } } // Matches categories case-insensitively
        ]
    });


    //extracting unique suggestions
    const suggestions = [...new Set(
        listings.map(l => l.location)
        .concat(listings.map(l => l.country))
        .concat(...listings.map(l => l.categories))
    )];

    function getRelevantSuggestions(query, suggestions) {
        query = query.toLowerCase();  // Convert query to lowercase
    
        // Filter suggestions where the word contains the query
        return suggestions.filter(suggestion => suggestion.toLowerCase().includes(query));
    }

    let relevantSuggestions = getRelevantSuggestions(q, suggestions);

    // console.log("listing suggestions api was called")

    res.json(relevantSuggestions);
}


//7) search suggestions api----------------------------------------------------------
module.exports.listingSearchApi = async (req, res)=>{
    const {q} = req.query;

    if(!q){
        return res.json([]);
    }

    const listings = await Listing.find({
        $or: [
            { location: new RegExp(q, "i") },
            { country: new RegExp(q, "i") },
            { categories: { $elemMatch: { $regex: q, $options: "i" } } }
        ]
    }).populate("reviews");

    // console.log("listing search api was called")

    res.json(listings);
}