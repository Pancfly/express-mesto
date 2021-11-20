const CardModel = require('../models/card');

const Error400 = 400;
const Error404 = 404;
const Error500 = 500;

module.exports.getCards = (req, res) => {
  CardModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.createCard = (req, res) => {
  const user = req.user._id;
  const { name, link } = req.body;
  if (!name || !link) {
    return res.status(Error400).send({ message: '400 — Переданы некорректные данные при создании карточки.' });
  }
  return CardModel.create({ name, link, owner: user })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(Error404).send({ message: '404 — Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send({ message: 'Карточка удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(Error400).send({ message: '400 — Переданы некорректные данные для удаления карточки' });
      }
      return res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.likeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(Error404).send({ message: '404 — Передан несуществующий _id карточки.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(Error400).send({ message: '400 — Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};

module.exports.dislikeCard = (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(Error404).send({ message: '404 — Передан несуществующий _id карточки.' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(Error400).send({ message: '400 — Переданы некорректные данные для постановки/снятии лайка.' });
      }
      return res.status(Error500).send({ message: '500 — Ошибка по умолчанию.' });
    });
};