const mongoose = require('mongoose');
const Course = require('./course');
const { ObjectId } = mongoose.Schema.Types;
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
    price: { type: Number },
    title: { type: String },
    subtitle: { type: String },
    description: { type: String, default: '' },
    type: { type: String, enum: Object.values(PRICING_PLAN_TYPE), required: true },
    courseId: { type: ObjectId, ref: 'course', required: true },
    isRecurring: { type: Boolean, default: false },
    purchaseUrl: { type: String, default: '' },
    period: { type: Number },
    deleted: { type: Boolean, default: false },
    deletedAt: Date
  },
  DEFAULT_OPTIONS
);

PRICING_PLAN.statics.create = async args => {
  const { id, ...rest } = args;
  let plan;
  if (id) {
    // const _plan = await PricingPlan.findById(id);
    plan = await PricingPlan.findById(id);
    Object.assign(plan, rest);
  } else {
    plan = new PricingPlan(rest);
  }
  const saved = await plan.save();
  console.log('Saved ->', saved);
  const course = await Course.findById(rest.courseId);
  await course.addPricing(saved._id);
  return saved;
};

PRICING_PLAN.statics.delete = async (id, course) => {
  const [plan, _course] = await Promise.all([PricingPlan.findById(id), Course.findById(course)]);
  if (!plan || !_course) {
    const error = new Error(`Plan or course is not found`);
    error.status = 404;
    throw error;
  } else {
    plan.deleted = true;
    plan.deletedAt = new Date();
    await _course.removePricing(course);
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
