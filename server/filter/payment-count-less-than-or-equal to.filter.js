module.exports = {
  label: 'Payment count less than or equal to',
  type: 'number',
  order: 115,
  filter(count) {
    return { loginCount: { $gt: Number(count) } };
  }
};
