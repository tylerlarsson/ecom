module.exports = {
  label: 'Refunded before',
  type: 'date',
  order: 75,
  filter(/* date */) {
    return false;
  }
};
