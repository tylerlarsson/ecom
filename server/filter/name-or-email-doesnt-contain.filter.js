module.exports = {
  label: "Name or Email doesn't contain",
  filter(inclusion) {
    const re = new RegExp(inclusion);
    return [
      {
        $not: {
          $or: [{ firstname: re }, { lastname: re }, { email: re }]
        }
      }
    ];
  }
};
