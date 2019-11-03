/* eslint-disable no-param-reassign */
const DEFAULT_OPTIONS = {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
};
/* eslint-enable no-param-reassign */

module.exports = { DEFAULT_OPTIONS };
