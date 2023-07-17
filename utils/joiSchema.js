const joi = require("joi")

module.exports.campSchema =  joi.object({
    campground:joi.object({
        title: joi.string().required(),
        images: joi.object({
            url: joi.string().required(),
            filename: joi.string().required()
        }).required(),
        price: joi.number().required().min(0),
        location: joi.string().required(),
        description: joi.string().required()
}).required()
})

module.exports.reviewSchema = joi.object({
    review:joi.object({
        body : joi.string().required(),
        rating: joi.number().required().min(0).max(5)
    }).required()
})