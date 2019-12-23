module.exports = {
  label: 'Payment count over',
  type: 'number',
  order: 110,
  filter(count) {
    return { loginCount: { $gt: Number(count) } };
  }
};
