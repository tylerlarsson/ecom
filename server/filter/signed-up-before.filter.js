module.exports = {
  label: 'Signed up before',
  filter(date) {
    return { created: { $lt: new Date(Number(date)) } };
  }
};
