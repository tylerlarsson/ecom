module.exports = {
  label: 'Signed up after',
  type: 'date',
  order: 10,
  filter(date) {
    return { created: { $gt: new Date(Number(date) * 1000) } };
  }
};
