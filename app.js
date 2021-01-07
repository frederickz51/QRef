const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/CatchAsync')
const ExpressError = require('./utils/ExpressError')
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});


app.get('/questions', catchAsync(async (req, res) => {
    const questions = await Question.find({});
    res.render('questions/index', { questions })
}));

app.get('/questions/ask', catchAsync(async (req, res) => {
    res.render('questions/ask')
}));

app.post('/questions', catchAsync(async (req, res, next) => {
    if (!req.body.question) throw new ExpressError("Invalid Question Datad", 400);
    const question = new Question(req.body.question)
    await question.save()
    res.redirect(`/questions/${question._id}`)
}));


app.get('/questions/:id', catchAsync(async (req, res) => {
    const question = await Question.findById(req.params.id)
    res.render('questions/show', { question })
}));

app.get('/questions/:id/edit', catchAsync(async (req, res) => {
    const question = await Question.findById(req.params.id)
    res.render('questions/edit', { question })
}));

app.put('/questions/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const question = await Question.findByIdAndUpdate(id, { ...req.body.question })
    res.redirect(`/questions/${question._id}`)
}));

app.delete('/questions/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Question.findByIdAndDelete(id)
    res.redirect('/questions')
}));


app.all('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Unknown Error"
    res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
    console.log('Serving on port 3000.')
})