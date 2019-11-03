module.exports = {
  label: 'Last login before',
  filter(date) {
    return { loginLast: { $lt: new Date(Number(date)) } };
  }
};
