const express = require('express');

const mongoose = require('mongoose', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const userRouters = require('./routes/user');
const cardRouters = require('./routes/card');

const app = express();

const mestodb = 'mongodb://localhost:27017/mestodb';
const { PORT = 3000 } = process.env;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '61993d4c987de8223ce32b8b',
  };

  next();
});

app.use('/', userRouters);
app.use('/', cardRouters);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

mongoose.connect(mestodb);