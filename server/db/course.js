const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');

const COURSE_STATE = {
  DRAFT: 'draft',
  ACTIVE: 'active'
};

const LECTURE = new mongoose.Schema({
  title: { type: String, index: true },
  file: String,
  image: String,
  text: { type: String, index: true },
  allowComments: Boolean,
  state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
  createdAt: Date,
  updatedAt: Date
});

const SECTION = new mongoose.Schema({
  title: { type: String, index: true },
  lectures: [LECTURE]
});

const COURSE = new mongoose.Schema(
  {
    title: { type: String, index: true },
    subtitle: { type: String, index: true },
    authors: [{ type: ObjectId, ref: 'user' }],
    state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
    sections: [SECTION]
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

COURSE.methods.createSection = async function createSection({ index, title }) {
  if (!this.sections) {
    this.sections = [];
  }
  if (index < this.sections.length) {
    this.sections[index].title = title;
  } else {
    this.sections.push({ title, lectures: [] });
  }
  await this.save();
  return this.sections.length;
};

COURSE.methods.createLecture = async function createLecture(
  sectionIndex,
  { index, title, file, image, text, allowComments, state }
) {
  if (sectionIndex < this.sections.length) {
    const section = this.sections[sectionIndex];
    if (index < section.lectures.length) {
      Object.assign(section.lectures[index], {
        title,
        file,
        image,
        text,
        allowComments,
        state,
        updatedAt: new Date()
      });
    } else {
      section.lectures.push({
        title,
        file,
        image,
        text,
        allowComments,
        state,
        createdAt: new Date()
      });
    }
    await this.save();
    return section.lectures.length;
  }
  return 0;
};

const Course = mongoose.model('course', COURSE);

module.exports = Course;
