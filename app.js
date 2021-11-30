const express = require('express');

const { celebrate, Joi } = require('celebrate');

const mongoose = require('mongoose', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/user');
const userRouters = require('./routes/user');
const cardRouters = require('./routes/card');

const NotFoundError = require('./errors/not-found-error');

const app = express();

const mestodb = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+)*#*$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouters);
app.use('/', cardRouters);

app.use('*', () => {
  throw new NotFoundError('Не существующий адрес.');
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

mongoose.connect(mestodb);
