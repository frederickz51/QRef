const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Question = require('./models/question');


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


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});


app.get('/questions', async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', { questions })
});

app.get('/questions/ask', async (req, res) => {
    res.render('questions/ask')
});
app.post('/questions', async (req, res) => {
    const question = new Question(req.body.question)
    await question.save()
    res.redirect(`/questions/${question._id}`)
});

app.get('/questions/:id', async (req, res) => {
    const question = await Question.findById(req.params.id)
    res.render('questions/show', { question })
});

app.get('/questions/:id/edit', async (req, res) => {
    const question = await Question.findById(req.params.id)
    res.render('questions/edit', { question })
});

app.put('/questions/:id', async (req, res) => {
    const { id } = req.params
    const question = await Question.findByIdAndUpdate(id, {... req.body.question})
    res.redirect(`/questions/${question._id}`)
})

app.delete('/questions/:id', async (req, res) => {
    const { id } = req.params
    await Question.findByIdAndDelete(id)
    res.redirect('/questions')
})

app.listen(3000, () => {
    console.log('Serving on port 3000.')
})