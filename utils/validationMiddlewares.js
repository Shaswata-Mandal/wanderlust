const {reviewSchema, listingSchema}=require("../schema");
const ExpressError=require("../utils/ExpressError");

module.exports.validateListing = (req, res, next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview = (req, res, next)=>{

    //asking joi for validation
    let {error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}