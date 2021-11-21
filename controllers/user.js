const UserModel = require('../models/user');

const Error400 = 400;
const Error404 = 404;
const Error500 = 500;
const Ok200 = 200;

module.exports.getUsers = (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(Ok200).send(data);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию' });
    });
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные для поиска пользователя' });
      } else if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  UserModel.create({ name, about, avatar })
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      } else if (err.name === 'ValidationError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении профиля пользователя' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      } else if (err.errors) {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении аватара пользователя' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};
