const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Unauthorized = require('../errors/Unauthorized');
const URL_REGEX = require('../utils/constans');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина имени — 2 символа'],
    maxlength: [30, 'Максимальная длина имени — 30 символов'],
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина имени — 2 символа'],
    maxlength: [30, 'Максимальная длина имени — 30 символов'],
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return URL_REGEX.test(url);
      },
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    unique: true,
    validate: {
      validator(email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
