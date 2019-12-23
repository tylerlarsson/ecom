module.exports = {
  label: 'Signed up with affiliate code',
  type: 'string',
  order: 40,
  filter(/* code */) {
    return false;
  }
};
