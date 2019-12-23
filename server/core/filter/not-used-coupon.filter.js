module.exports = {
  label: 'No used coupon',
  type: 'string',
  order: 125,
  filter(/* value */) {
    return false;
  }
};
