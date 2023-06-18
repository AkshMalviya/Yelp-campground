const joi = require("joi")

module.exports.campSchema =  joi.object({
    campground:joi.object({
        title: joi.string().required(),
        price: joi.string().required().min(0),
        image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()
}).required()
})