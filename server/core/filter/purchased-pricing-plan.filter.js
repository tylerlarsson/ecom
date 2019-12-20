module.exports = {
  label: 'Purchased Pricing Plan',
  type: 'boolean',
  order: 85,
  filter(/* plan */) {
    return false;
  }
};
