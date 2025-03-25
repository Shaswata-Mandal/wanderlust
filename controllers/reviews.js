const Review=require("../models/review");
const Listing=require("../models/listing");


//1) for creating a review----------------------------------------
module.exports.createReview = async (req, res)=>{

    let {id}= req.params;
    
    //finding the particular listing for which the review has been submitted
    let listing= await Listing.findById(id);

    if(listing.owner._id.equals(req.user._id)){
        req.flash("error", "Owner cannot post reviews");
        return res.redirect(`/listings/${id}`);
    }

    //creating a new review
    let newReview = new Review(req.body.review);

    newReview.author=req.user._id;

    //adding the new review to the review array in the listing shcema
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review was psoted");
    res.redirect(`/listings/${req.params.id}`);
};


//2)for deleting a review----------------------------------------
module.exports.destroyReview = async (req, res)=>{
    let {id, reviewId} = req.params;

    let review=await Review.findById(reviewId).populate("author");

    if(!review.author._id.equals(req.user._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    //deleting the review id from the reviews array in the listing
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});

    //deleting the review
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review was deleted");
    res.redirect(`/listings/${id}`);
};
