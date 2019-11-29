const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');
const { generateUploadUrl, uploadVideo } = require('../file-util');
const { softDeletedMiddleware, removeNestedSoftDeleted } = require('../middleware/soft-deleted');

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
  updatedAt: Date,
  deletedAt: Date,
  deleted: { type: Boolean, default: false }
});

const SECTION = new mongoose.Schema({
  title: { type: String, index: true },
  lectures: [LECTURE],
  deletedAt: Date,
  deleted: { type: Boolean, default: false }
});

const COURSE = new mongoose.Schema(
  {
    title: { type: String, index: true },
    subtitle: { type: String, index: true },
    authors: [{ type: ObjectId, ref: 'user' }],
    state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
    sections: [SECTION],
    deletedAt: Date,
    deleted: { type: Boolean, default: false }
  },
  DEFAULT_OPTIONS
);

COURSE.pre('find', softDeletedMiddleware);
COURSE.pre('findOne', softDeletedMiddleware);
COURSE.pre('count', softDeletedMiddleware);
COURSE.pre('countDocuments', softDeletedMiddleware);
COURSE.pre('findById', softDeletedMiddleware);

COURSE.post('find', removeNestedSoftDeleted);
COURSE.post('findOne', removeNestedSoftDeleted);
COURSE.post('count', removeNestedSoftDeleted);
COURSE.post('countDocuments', removeNestedSoftDeleted);
COURSE.post('findById', removeNestedSoftDeleted);

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

COURSE.statics.deleteCourse = async course => {
  const _course = await Course.findById(course);
  if (!_course) {
    const error = new Error(`No course with id ${course} is found.`);
    error.status = 404;
    throw error;
  } else {
    _course.deleted = true;
    _course.deletedAt = new Date();
    return _course.save();
  }
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
  { index, title, image, text, allowComments, state },
  file
) {
  if (sectionIndex < this.sections.length) {
    const section = this.sections[sectionIndex];
    file = file ? await uploadVideo({ file }) : null;

    if (index < section.lectures.length) {
      Object.assign(section.lectures[index], {
        file: file && file.url,
        updatedAt: new Date(),
        title,
        image,
        text,
        allowComments,
        state
      });
    } else {
      section.lectures.push({
        file: file && file.url,
        createdAt: new Date(),
        title,
        image,
        text,
        allowComments,
        state
      });
    }
    await this.save();
    return {
      lectureCount: section.lectures.length,
      image: image ? await generateUploadUrl(image) : null,
      file
    };
  }
  return 0;
};

COURSE.methods.deleteLecture = async function deleteLecture(section, lecture) {
  const _section = this.sections.id(section);
  if (!_section) {
    const error = new Error(`Section for id ${section} is not found`);
    error.status = 404;
    throw error;
  } else {
    const _lecture = _section.lectures.find(i => i._id.toString() === lecture);
    if (!_lecture) {
      const error = new Error(`Lecture for id ${lecture} is not found`);
      error.status = 404;
      throw error;
    }
    _lecture.deleted = true;
    _lecture.deletedAt = new Date();
    return this.save();
  }
};

COURSE.methods.deleteSection = async function deleteSection(section) {
  const subDoc = this.sections.id(section);
  if (!subDoc) {
    const error = new Error(`Section for id ${section} is not found.`);
    error.status = 404;
    throw error;
  } else {
    subDoc.deleted = true;
    subDoc.deletedAt = new Date();
    return this.save();
  }
};

const Course = mongoose.model('course', COURSE);

module.exports = Course;
