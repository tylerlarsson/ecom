const HttpStatus = require('http-status-codes');
const { PRICING_PLAN_TYPE } = require('../db/common');

const handlers = {
  /* eslint-disable */
  stripe: {
    [PRICING_PLAN_TYPE.ONE_TIME]: require('./drivers/stripe').charge,
  },
  paypal: {
    [PRICING_PLAN_TYPE.ONE_TIME]: require('./drivers/paypal').singlePayment
  }
};

module.exports = (service, pricingPlanType, args) => {
  const handler = handlers[service] && handlers[service][pricingPlanType];
  if (!handler) {
    const error = new Error(`Service or pricing plan type is not defined.`);
    error.status = HttpStatus.BAD_REQUEST;
    throw error;
  }
  return handler.call(this, args);
};
