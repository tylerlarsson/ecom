module.exports = {
  label: 'Refunded after',
  type: 'date',
  order: 80,
  filter(/* date */) {
    return false;
  }
};
