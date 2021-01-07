const Joi = require('joi');

module.exports.questionJoiSchema = Joi.object({
    question: Joi.object({
        title: Joi.string().max(250).required(),
        content: Joi.string(),
    }).required()
});