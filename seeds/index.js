const mongoose = require('mongoose');
const faker = require('faker')
const Question = require('../models/question')


mongoose.connect("mongodb://localhost:27017/qref", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: "));
db.once('open', () => {
    console.log("Database connected.")
});


faker.seed(2021);


const seedDB = async () => {
    await Question.deleteMany({});
    const emptyContentProb = 0.1;
    for (let i = 0; i < 50; i++) {
        if (Math.random() < 0.1) {
            const q = new Question({
                title: `${faker.lorem.sentence(10)}`
            })
            await q.save();
        } else {
            const q = new Question({
                title: `${faker.lorem.sentence(10)}`,
                content: `${faker.lorem.paragraph(5)}`
            })
            await q.save();
        }
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});