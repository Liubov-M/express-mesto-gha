const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const URL_REGEX = require('../utils/constans');
const NotFoundError = require('../errors/NotFoundError');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(4),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(URL_REGEX),
    }),
  }),
  createUser,
);
router.use(auth);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
