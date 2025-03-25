const mongoose= require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String, 
    rating: {
        type: Number, 
        min: 1, 
        max: 5
    }, 
    createdAt: {
        type: Date, 
        default: Date.now()
    }, 
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review= mongoose.model("Review", reviewSchema);

module.exports = Review;

//we are considering listing and review relationship as 1 to n and we wil 
// integrate a review array in the listing schema itself as the reviews
// per listing will not be greater than million