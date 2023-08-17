const mongoose = require('mongoose');
const URL_REGEX = require('../utils/constans');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    minlength: [2, 'минимальная длина имени — 2 символа'],
    maxlength: [30, 'максимальная длина имени — 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Поле обязательно к заполнению'],
    validate: {
      validator(url) {
        return URL_REGEX.test(url);
      },
      message: 'Введите URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
