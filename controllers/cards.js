const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные при создании карточки' }));
      } else {
        next(err);
      }
    });
};
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные при создании карточки' }));
      } else {
        next(err);
      }
    });
};
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('notValidId'))
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new ForbiddenError('Чужую карточку нельзя удалять'));
      } else {
        Card.deleteOne(card)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }));
      }
    })
    .catch((err) => {
      if (err.message === 'notValidId') {
        next(new NotFoundError({ message: 'Карточка с указанным id не найдена' }));
      } else {
        next(new BadRequestError({ message: 'Указан некорректный id карточки' }));
      }
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('Error'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные для постановки лайка' }));
      } else if (err.message === 'Error') {
        next(new NotFoundError({ message: 'Карточка с указанным id не найдена' }));
      } else {
        next(err);
      }
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('Error'))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError({ message: 'Переданы некорректные данные для снятии лайка' }));
      } else if (err.message === 'Error') {
        next(new NotFoundError({ message: 'Карточка с указанным id не найдена' }));
      } else {
        next(err);
      }
    });
};
