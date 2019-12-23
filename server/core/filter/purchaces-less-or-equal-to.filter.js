module.exports = {
  label: 'Purchases less or equal to',
  type: 'money',
  order: 105,
  filter(/* value */) {
    return false;
  }
};
