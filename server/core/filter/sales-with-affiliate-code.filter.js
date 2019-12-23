module.exports = {
  label: 'Sales with affiliate code',
  type: 'string',
  order: 130,
  filter(/* value */) {
    return false;
  }
};
