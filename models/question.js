const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: String,
    content: String
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);