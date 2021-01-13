const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const { questionJoiSchema, answerJoiSchema } = require('./utils/JoiSchemas')
const methodOverride = require('method-override')
const Question = require('./models/question');
const Answer = require('./models/answer')


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


const validateQuestion = (req, res, next) => {
    const { error } = questionJoiSchema.validate(req.body)
    if (error) {
        const detail = error.details.map(el => el.message).join(', ')
        throw new ExpressError(400, "Invalid Question Data", detail)
    } else {
        next();
    }
    console.log(result)
}

const validateAnswer = (req, res, next) => {
    const { error } = answerJoiSchema.validate(req.body)
    if (error) {
        const detail = error.details.map(el => el.message).join(', ')
        throw new ExpressError(400, "Invalid Question Data", detail)
    } else {
        next()
    }
}


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

app.post('/questions', validateQuestion, catchAsync(async (req, res, next) => {
    const question = new Question(req.body.question)
    await question.save()
    res.redirect(`/questions/${question._id}`)
}));

app.get('/questions/:id', catchAsync(async (req, res) => {
    const question = await Question.findById(req.params.id).populate('answers')
    console.log(question)
    res.render('questions/view', { question })
}));

app.get('/questions/:id/edit', catchAsync(async (req, res) => {
    const question = await Question.findById(req.params.id)
    res.render('questions/edit', { question })
}));

app.put('/questions/:id', validateQuestion, catchAsync(async (req, res) => {
    const { id } = req.params
    const question = await Question.findByIdAndUpdate(id, { ...req.body.question })
    res.redirect(`/questions/${question._id}`)
}));

app.delete('/questions/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Question.findByIdAndDelete(id)
    res.redirect('/questions')
}));


app.post('/questions/:id/answers', validateAnswer, catchAsync(async (req, res) => {
    const question = await Question.findById(req.params.id)
    const answer = new Answer(req.body.answer)
    question.answers.push(answer)
    await answer.save()
    await question.save()
    res.redirect(`/questions/${question._id}`)
}))


app.all('*', (req, res, next) => {
    const fullUrl = req.protocol + "://" + req.get('host') + req.url
    next(new ExpressError(404, "Page Not Found", "This site does not exist: " + fullUrl))
});

app.use((error, req, res, next) => {
    const { statusCode = 500 } = error
    if (!error.message) error.message = "Unknown Error"
    if (!error.detail) error.detail = "Unknown error occurs."
    res.status(statusCode).render('error', { error })
});

app.listen(3000, () => {
    console.log('Serving on port 3000.')
})