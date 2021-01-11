const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title: String,
    content: String,
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Answer"
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);