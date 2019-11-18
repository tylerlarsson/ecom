const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');

const COURSE_STATE = {
  DRAFT: 'draft',
  ACTIVE: 'active'
};

const COURSE = new mongoose.Schema(
  {
    title: { type: String, index: true },
    subtitle: { type: String, index: true },
    authors: [{ type: ObjectId, ref: 'user' }],
    state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true }
  },
  DEFAULT_OPTIONS
);

COURSE.statics.create = async ({ id, title, subtitle, authors }) => {
  let course;
  if (id) {
    course = await Course.findById(id);
    course.title = title;
    course.subtitle = subtitle;
    course.authors = authors;
  } else {
    course = new Course({ title, subtitle, authors, state: COURSE_STATE.DRAFT });
  }
  return course.save();
};

const Course = mongoose.model('course', COURSE);

module.exports = Course;
