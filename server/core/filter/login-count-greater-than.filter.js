module.exports = {
  label: 'Login count greater than',
  type: 'number',
  order: 25,
  filter(count) {
    return { loginCount: { $gt: Number(count) } };
  }
};
