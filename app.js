const path = require('path');
const mongoose = require('mongoose')
const express = require('express');

const routes = require('./routes/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
const app = express();

app.listen(PORT, () => {
  console.log(`Servers is running on ${PORT}`)
})