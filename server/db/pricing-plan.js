const mongoose = require('mongoose');
const { DEFAULT_OPTIONS } = require('./common');
const { softDeletedMiddleware } = require('../middleware/soft-deleted');

const PRICING_PLAN_TYPE = {
  FREE: 'free',
  SUBSCRIPTION: 'subscription',
  ONE_TIME: 'one-time',
  PAYMENT_PLAN: 'payment-plan'
};

const PRICING_PLAN = new mongoose.Schema(
  {
    amount: { type: Number, index: true },
    title: { type: String, index: true, required: true },
    subtitle: { type: String, index: true, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: Object.values(PRICING_PLAN_TYPE), index: true, required: true },
    deleted: Boolean,
    deletedAt: Date
  },
  DEFAULT_OPTIONS
);

PRICING_PLAN.statics.create = async ({ id, amount, title, subtitle, description, type }) => {
  let plan;
  if (id) {
    plan = await PricingPlan.findById(id);
    plan.amount = amount;
    plan.title = title;
    plan.subtitle = subtitle;
    plan.description = description;
    plan.type = type;
  } else {
    plan = new PricingPlan({ amount, title, subtitle, description, type });
  }
  return plan.save();
};

PRICING_PLAN.statics.delete = async id => {
  const plan = await PricingPlan.findById(id);
  if (!plan) {
    const error = new Error(`Plan with id ${id} is not found`);
    error.status = 404;
    throw error;
  } else {
    plan.deleted = true;
    plan.deletedAt = new Date();
  }
  return plan.save();
};

PRICING_PLAN.pre('find', softDeletedMiddleware);
PRICING_PLAN.pre('findOne', softDeletedMiddleware);
PRICING_PLAN.pre('count', softDeletedMiddleware);
PRICING_PLAN.pre('countDocuments', softDeletedMiddleware);
PRICING_PLAN.pre('findById', softDeletedMiddleware);

const PricingPlan = mongoose.model('pricing-plan', PRICING_PLAN);

module.exports = PricingPlan;
