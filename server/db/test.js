const mongoose = require('mongoose');
const config = require('../config');
mongoose.Promise = Promise;

/* eslint-disable global-require */

module.exports = {
  model: {
    User: require('./user'),
    Role: require('./role'),
    Permission: require('./permission')
  },
  open() {
    return mongoose.connect(config.get('db:url'), { useNewUrlParser: true });
  },
  close() {
    return mongoose.connection.close();
  }
};
