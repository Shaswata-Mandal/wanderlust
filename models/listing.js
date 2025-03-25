const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review");

const listingSchema= new Schema({
    title: {
        type: String, 
        required: true
    },
    description: String, 
    image: {
        url: {
            type: String,  
            default: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHRva3lvfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
        },
        filename: {
            type: String, 
            default: "image"
        }   
    },
    price: Number, 
    location: String, 
    country: String, 
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }, 
    categories: {
        type: [String], 
        enum: [
            "amazing_pools", "icons", "omg", "islands", "countryside", "new",
            "amazing_views", "farms", "mansion", "bed_and_breakfast", "beachfront",
            "luxe", "tiny_homes", "lake", "towers", "treehouses", "top_of_the_world",
            "room", "cabins", "skiing", "national_parks", "houseboats", "arctic",
            "camping", "lakefront", "boats", "trending", "domes", "caves", "play",
            "a_frames", "earth_homes", "castles", "tropical", "camper_vans", "design",
            "surfing", "historical_homes", "top_cities", "vineyards", "golfing",
            "hanoks", "cycladic_homes", "windmills", "chef's_kitchens", "shepherd's_huts",
            "casas_particulares", "desert", "ryokans", "minsus", "yurts", "barns",
            "ski-in_or_out", "off_the_grid", "adapted", "containers", "beach", "riads",
            "trulli", "eco_friendly", "luxury", "mountain_views", "mountains"
        ],
        required: true
    }
});

//creating a post mongoose middleware so that when a listing is deleted 
//all its related reviews gets deleted from the review collection
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing", listingSchema);
module.exports=Listing;