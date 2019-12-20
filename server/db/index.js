const mongoose = require('mongoose');
const config = require('../core/config');

mongoose.Promise = Promise;
mongoose.connect(config.get('db:url'), { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

/* eslint-disable global-require */
module.exports = {
  model: {
    User: require('./user'),
    Role: require('./role'),
    Permission: require('./permission'),
    Course: require('./course'),
    PricingPlan: require('./pricing-plan'),
    Page: require('./page'),
    Navigation: require('./navigation'),
    InternalComment: require('./internal-comment')
  }
};
