module.exports = {
  label: 'Purchases Greater Than',
  type: 'money',
  order: 100,
  filter(/* value */) {
    return false;
  }
};
