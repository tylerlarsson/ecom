module.exports = {
  label: 'From country code',
  type: 'string',
  order: 30,
  filter(/* code */) {
    return false;
  }
};
