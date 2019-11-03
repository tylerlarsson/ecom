module.exports = {
  label: 'Signed up after',
  filter(date) {
    return { created: { $gt: new Date(Number(date)) } };
  }
};
