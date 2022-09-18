const Joi = require('joi');
module.exports.groupSchema = Joi.object({
    group: Joi.object({
       title: Joi.string().required(),
        //image: Joi.string().required(),
        description: Joi.string().required(),
        members: Joi.array().optional()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})