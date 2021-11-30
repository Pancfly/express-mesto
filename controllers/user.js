const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const Error400 = 400;
const Error404 = 404;
const Error409 = 409;
const Ok200 = 200;

module.exports.getUsers = (req, res, next) => {
  UserModel.find()
    .then((data) => {
      res.status(Ok200).send(data);
    })
    .catch(() => {
      next();
    });
};

module.exports.getUserId = (req, res, next) => {
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
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => UserModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(Ok200).send({
        id: user._id, email: user.email, name: user.name, abote: user.aboute, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при создании пользователя' });
      } else if (err.name === 'MongoError' && err.code === 11000) {
        res.status(Error409).send({ message: '409 — Пользователь с таким email уже существует' });
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении профиля пользователя' });
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(Ok200).send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении аватара пользователя' });
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      res.send({
        token: jwt.sign(payload, '19randomrabbits', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  UserModel.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении аватара пользователя' });
      }
      next(err);
    });
};
