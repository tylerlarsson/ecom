module.exports = {
  label: 'Login count greater than',
  filter(count) {
    return { loginCount: { $gt: Number(count) } };
  }
};
