module.exports = {
  label: 'Signed up before',
  type: 'date',
  order: 5,
  filter(date) {
    return { created: { $lt: new Date(Number(date)) } };
  }
};
