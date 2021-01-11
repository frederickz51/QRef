const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    reference: String,
    comment: String
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);