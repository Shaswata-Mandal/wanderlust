//server side validation (form validations)
const Joi=require("joi");

//validation for listing model(Schema)
module.exports.listingSchema=Joi.object({
    listing: Joi.object({
        title: Joi.string().required(), 
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(), 
        price: Joi.number().required().min(0),
        imageUrl: Joi.string().uri().allow("").messages({
            "string.uri": "Invalid image URL."
        }),
        image: Joi.object({
            url: Joi.string().uri().required().messages({
                "string.uri": "Invalid image URL.",
                "string.empty": "Image URL is required."
            }),
            filename: Joi.string().required().messages({
                "string.empty": "Image filename is required."
            })
        }).required().messages({
            "object.base": "Image must be provided."
        }),
        categories: Joi.array()
    }).required()
});

//validation for review model(Schema)
module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), 
        comment: Joi.string().required()
    }).required()
})