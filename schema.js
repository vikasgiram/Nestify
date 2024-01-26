const Joi=require("joi");

const listingSchema=Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required().unknown(true)
});


const reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().min(0).max(5).required(),
        comment: Joi.string().required(),
        date: Joi.date().optional()
    }).required()
});

module.exports={listingSchema,reviewSchema};