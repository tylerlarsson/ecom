module.exports = {
  label: 'Completed Course',
  type: 'string',
  order: 90,
  filter(/* plan */) {
    return false;
  }
};
