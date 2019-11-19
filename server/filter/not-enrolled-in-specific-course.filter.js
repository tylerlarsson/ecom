module.exports = {
  label: 'Not enrolled in specific course(s)',
  type: 'string',
  order: 50,
  filter(/* course */) {
    return false;
  }
};
