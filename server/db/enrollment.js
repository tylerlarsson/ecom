const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');
const User = require('./user');
const Course = require('./course');
const { error404 } = require('../core/util');

const ENROLLMENT = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'user', required: true },
    course: { type: ObjectId, ref: 'course', required: true }
  },
  DEFAULT_OPTIONS
);

ENROLLMENT.statics.enroll = async args => {
  const { user: _user, course: _course } = args;
  const [user, course] = await Promise.all([User.findById(_user), Course.findById(_course)]);
  if (!user) throw error404({ user }, _user);
  if (!course) throw error404({ course }, _course);
  const enrollment = new Enrollment(args).save();
  await user.addEnrollment(enrollment._id.toString());
  return enrollment;
};

ENROLLMENT.methods.delete = async function delete_() {
  const user = await User.findById(this.user);
  if (!user) throw error404({ user }, this.user);
  await Promise.all([Enrollment.findByIdAndDelete(this._id), user.discardEnrollment(this._id)]);
  return this;
};

const Enrollment = mongoose.model('enrollment', ENROLLMENT);

module.exports = Enrollment;
