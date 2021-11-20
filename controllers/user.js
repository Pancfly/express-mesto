const UserModel = require('../models/user');

const Error400 = 400;
const Error404 = 404;
const Error500 = 500;

module.exports.getUsers = (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию' });
    });
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(Error404).send({ message: '404 — Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(Error400).send({ message: '400 — Переданы некорректные данные для поиска пользователя' });
      }
      return res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(Error400).send({ message: '400 — Переданы некорректные данные при создании пользователя' });
  }
  return UserModel.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении профиля.' });
  }
  return UserModel.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(Error404).send({ message: '404 — Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(Error400).send({ message: '400 — Переданы некорректные данные при обновлении профиля.' });
  }
  return UserModel.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return res.status(Error404).send({ message: '404 — Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};