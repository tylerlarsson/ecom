module.exports = {
  label: 'Last login after',
  type: 'date',
  order: 20,
  filter(date) {
    return { loginLast: { $gt: new Date(Number(date) * 1000) } };
  }
};
