module.exports = {
  label: 'Last login after',
  filter(date) {
    return { loginLast: { $gt: new Date(Number(date)) } };
  }
};
