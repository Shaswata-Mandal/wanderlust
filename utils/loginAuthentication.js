const isLoggedIn=(req, res, next)=>{
    if(!req.isAuthenticated()){
        //saving redirect Url
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must log in to do the action");
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl= (req, res, next)=>{
    
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

const Listing=require("../models/listing");

const isOwner= async (req, res, next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = {isLoggedIn, saveRedirectUrl, isOwner};