const express = require('express');

const mongoose = require('mongoose', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errors');
const auth = require('./middlewares/auth');
const userRouters = require('./routes/user');
const cardRouters = require('./routes/card');

const Error404 = 404;

const app = express();

const mestodb = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

app.use(express.json());

app.use(auth);

app.use('/', userRouters);
app.use('/', cardRouters);

app.use('*', (req, res) => {
  res.status(Error404).send({ message: 'Не существующий адрес.' });
});

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

mongoose.connect(mestodb);
