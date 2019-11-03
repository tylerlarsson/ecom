const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = Promise;
mongoose.connect(config.get('db:url'), { useNewUrlParser: true });

/* eslint-disable global-require */

module.exports = {
  model: {
    User: require('./user'),
    Role: require('./role'),
    Permission: require('./permission')
  }
};
