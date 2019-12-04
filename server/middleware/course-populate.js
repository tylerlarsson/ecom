function populatePricing(next) {
  this.populate('pricingPlans');
  next();
}

module.exports = { populatePricing };
