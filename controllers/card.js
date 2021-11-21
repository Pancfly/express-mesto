const CardModel = require('../models/card');

const Error400 = 400;
const Error404 = 404;
const Error500 = 500;
const Ok200 = 200;

module.exports.getCards = (req, res) => {
  CardModel.find()
    .then((data) => {
      res.status(Ok200).send(data);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.createCard = (req, res) => {
  const user = req.user._id;
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: user })
    .then((card) => {
      res.status(Ok200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при создании карточки ' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndRemove(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      card.remove();
      res.status(Ok200).send({ message: 'Карточка удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные для удаления карточки' });
      } else if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Передан несуществующий _id карточки.' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(Ok200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные для постановки лайка.' });
      } else if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Передан несуществующий _id карточки.' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => {
      res.status(Ok200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные для снятии лайка.' });
      } else if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Передан несуществующий _id карточки.' });
      } else {
        res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
      }
    });
};
