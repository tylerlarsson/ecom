module.exports = {
  label: 'Last login before',
  type: 'date',
  order: 15,
  filter(date) {
    return { loginLast: { $lt: new Date(Number(date) * 1000) } };
  }
};
