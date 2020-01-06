/* eslint-disable no-param-reassign */
const DEFAULT_OPTIONS = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
};

const PRICING_PLAN_TYPE = {
  FREE: 'free',
  SUBSCRIPTION: 'subscription',
  ONE_TIME: 'one-time',
  PAYMENT_PLAN: 'payment-plan'
};

/* eslint-enable no-param-reassign */
module.exports = { DEFAULT_OPTIONS, PRICING_PLAN_TYPE };
