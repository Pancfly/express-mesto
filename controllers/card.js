const CardModel = require('../models/card');

const Error400 = 400;
const Error403 = 403;
const Error404 = 404;
const Ok200 = 200;

module.exports.getCards = (req, res, next) => {
  CardModel.find()
    .then((data) => {
      res.status(Ok200).send(data);
    })
    .catch(() => {
      next();
    });
};

module.exports.createCard = (req, res, next) => {
  const user = req.user._id;
  const { name, link } = req.body;
  CardModel.create({ name, link, owner: user })
    .then((card) => {
      res.status(Ok200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные при создании карточки ' });
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  CardModel.findByIdAndRemove(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        card.remove();
        res.status(Ok200).send({ message: 'Карточка удалена!' });
      } else {
        res.status(Error403).send({ message: 'Это карточка не ваша, у вас нет прав!' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(Error400).send({ message: '400 — Переданы некорректные данные для удаления карточки' });
      } else if (err.message === 'NotValidId') {
        res.status(Error404).send({ message: '404 — Передан несуществующий _id карточки.' });
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
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
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
      }
      next(err);
    });
};
