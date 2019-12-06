const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');
const { softDeletedMiddleware, removeNestedSoftDeleted } = require('../middleware/soft-deleted');
const { populatePricing } = require('../middleware/course-populate');

const COURSE_STATE = {
  DRAFT: 'draft',
  ACTIVE: 'active'
};

const CONTENT_TYPE = {
  TEXT: 'text',
  IMAGE: 'image'
};

const CONTENT = new mongoose.Schema({
  index: { type: Number },
  type: { type: String, enum: Object.values(CONTENT_TYPE), required: true },
  content: { type: String },
  url: { type: String }
});

const LECTURE = new mongoose.Schema({
  title: { type: String, index: true },
  file: String,
  image: String,
  text: { type: String, index: true },
  allowComments: Boolean,
  state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
  content: [CONTENT],
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
    pricingPlans: [{ type: ObjectId, ref: 'pricing-plan' }],
    pages: [{ type: ObjectId, ref: 'page' }],
    state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
    sections: [SECTION],
    deletedAt: Date,
    deleted: { type: Boolean, default: false }
  },
  DEFAULT_OPTIONS
);

COURSE.pre('find', populatePricing, softDeletedMiddleware);
COURSE.pre('findOne', populatePricing, softDeletedMiddleware);
COURSE.pre('count', populatePricing, softDeletedMiddleware);
COURSE.pre('countDocuments', populatePricing, softDeletedMiddleware);
COURSE.pre('findById', populatePricing, softDeletedMiddleware);

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

COURSE.methods.createSection = async function createSection({ section, title }) {
  if (!this.sections) {
    this.sections = [];
  }
  if (section) {
    const _section = this.sections.id(section);
    _section.title = title;
  } else {
    this.sections.push({ title, lectures: [] });
  }
  // if (index < this.sections.length) {
  //   this.sections[index].title = title;
  // } else {
  //   this.sections.push({ title, lectures: [] });
  // }
  const course = await this.save();
  return course.sections.find(s => s.title === title);
};

COURSE.methods.createLecture = async function createLecture(args) {
  const { section, id: _id, ...rest } = args;
  if (this.sections && this.sections.length) {
    const _section = this.sections.id(section);
    if (_id && _section.lectures && _section.lectures.length) {
      const _lecture = _section.lectures.id(_id);
      Object.assign(_lecture, {
        updatedAt: new Date(),
        ...rest
      });
    } else {
      _section.lectures.push({
        createdAt: new Date(),
        ...rest
      });
    }
    await this.save();
    return {
      lectureCount: _section.lectures.length
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

COURSE.methods.addPricing = async function addPricing(pricing) {
  this.pricingPlans.push(pricing);
  return this.save();
};

COURSE.methods.removePricing = async function removePricing(pricing) {
  const _pricing = this.pricingPlans.findIndex(_id => _id === pricing);
  if (!_pricing) {
    const error = new Error(`Pricing plan with id ${pricing} is not found in Course model.`);
    error.status = 404;
    throw error;
  }
  this.pricingPlans = this.pricingPlans.slice(_pricing, 1);
  return this.save();
};

COURSE.methods.addPage = function addPage(page) {
  this.pages.push(page);
  return this.save();
};

const Course = mongoose.model('course', COURSE);

module.exports = Course;
