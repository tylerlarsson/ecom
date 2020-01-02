module.exports = {
  label: 'Completed CourseAdmin',
  type: 'string',
  order: 90,
  filter(/* plan */) {
    return false;
  }
};
