const mongoose = require('mongoose');
const Answer = require('./answer');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: String,
    content: String,
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Answer"
        }
    ]
}, { timestamps: true });

QuestionSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Answer.deleteMany({
            _id: {
                $in: doc.answers
            }
        })
    }
})

module.exports = mongoose.model('Question', QuestionSchema);