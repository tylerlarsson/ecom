module.exports = {
  label: 'Uses coupon',
  type: 'string',
  order: 120,
  filter(/* code */) {
    return false;
  }
};
