module.exports = {
  label: 'Enrolled in specific course(s) after',
  type: 'date',
  order: 60,
  filter(/* course */) {
    return false;
  }
};
