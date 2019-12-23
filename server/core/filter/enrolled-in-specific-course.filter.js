module.exports = {
  label: 'Enrolled in specific course(s)',
  type: 'string',
  order: 45,
  filter(/* course */) {
    return false;
  }
};
