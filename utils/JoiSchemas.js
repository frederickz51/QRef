const Joi = require('joi');

module.exports.questionJoiSchema = Joi.object({
    question: Joi.object({
        title: Joi.string().max(250).required(),
        content: Joi.string(),
    }).required()
});

module.exports.answerJoiSchema = Joi.object({
    answer: Joi.object({
        reference: Joi.string().required(),
        comment: Joi.string()
    }).required()
});