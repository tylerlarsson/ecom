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

const CONTENT = new mongoose.Schema(
  {
    index: { type: Number },
    type: { type: String, enum: Object.values(CONTENT_TYPE), required: true },
    content: { type: String },
    url: { type: String }
  },
  DEFAULT_OPTIONS
);

const LECTURE = new mongoose.Schema(
  {
    title: { type: String, index: true },
    file: String,
    image: String,
    text: { type: String },
    allowComments: Boolean,
    state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
    content: [CONTENT],
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
    deleted: { type: Boolean, default: false }
  },
  DEFAULT_OPTIONS
);

const SECTION = new mongoose.Schema(
  {
    index: { type: Number },
    title: { type: String, index: true },
    lectures: [LECTURE],
    deletedAt: Date,
    deleted: { type: Boolean, default: false }
  },
  DEFAULT_OPTIONS
);

const COURSE = new mongoose.Schema(
  {
    title: { type: String, index: true },
    subtitle: { type: String, index: true },
    authors: [{ type: ObjectId, ref: 'user' }],
    pricingPlans: [{ type: ObjectId, ref: 'pricing-plan' }],
    pages: [{ type: ObjectId, ref: 'page' }],
    navigation: [{ type: ObjectId, ref: 'navigation' }],
    state: { type: String, enum: [COURSE_STATE.ACTIVE, COURSE_STATE.DRAFT], index: true },
    sections: [SECTION],
    deletedAt: Date,
    deleted: { type: Boolean, default: false }
  },
  DEFAULT_OPTIONS
);

COURSE.pre('find', softDeletedMiddleware, populatePricing);
COURSE.pre('findOne', softDeletedMiddleware, populatePricing);
COURSE.pre('count', softDeletedMiddleware, populatePricing);
COURSE.pre('countDocuments', softDeletedMiddleware, populatePricing);
COURSE.pre('findById', softDeletedMiddleware, populatePricing);

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

COURSE.methods.createSection = async function createSection(args) {
  const { id, sections = [], ...rest } = args;
  if (!this.sections) {
    this.sections = [];
  }
  if (sections && sections.length) {
    for (const { id: secId, ...rest } of sections) {
      if (secId) {
        const _section = this.sections.id(secId);
        if (!_section) {
          const error = new Error(`Section with id ${secId} is not found.`);
          error.status = 404;
          throw error;
        }
        Object.assign(_section, rest);
      } else {
        this.sections.push({ lectures: [], ...rest });
      }
    }
    await this.save();
    return this && this.sections;
  }
  if (id) {
    const _section = this.sections.id(id);
    if (!_section) {
      const error = new Error(`Section with id ${id} is not found.`);
      error.status = 404;
      throw error;
    }
    Object.assign(_section, { ...rest });
  } else {
    this.sections.push({ ...rest });
  }
  const course = await this.save();
  return course && course.sections;
};

COURSE.methods.createLecture = async function createLecture(args) {
  const { section, ...rest } = args;
  if (this.sections && this.sections.length) {
    const _section = this.sections.id(section);
    console.log(section, _section);
    if (!_section) {
      const error = new Error(`No section with id ${section} is found`);
      error.status = 404;
      throw error;
    }
    _section.lectures.push({
      createdAt: new Date(),
      ...rest
    });
    await this.save();
    return this.sections.id(section).lectures;
  }
};

COURSE.methods.editLecture = async function editLecture(args) {
  const { lecture, section, ...rest } = args;
  if (this.sections && this.sections.length) {
    const _section = this.sections.id(section);
    if (!_section) {
      const error = new Error(`No section with id ${section} is found`);
      error.status = 404;
      throw error;
    }
    const _lecture = _section.lectures.id(lecture);
    if (!_lecture) {
      const error = new Error(`No lecture with id ${lecture} is found`);
      error.status = 404;
      throw error;
    }
    Object.assign(_lecture, { ...rest, updatedAt: new Date() });
    await this.save();
    return this.sections.id(section).lectures;
  }
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
    return this.sections.id(section).lectures;
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

COURSE.methods.addNavigation = function addNavigation(navigation) {
  this.navigation.push(navigation);
  return this.save();
};

COURSE.methods.removeNavigation = function removeNavigation(navigation) {
  const idxNav = this.navigation.findIndex(i => i._id === navigation);
  if (!idxNav) {
    const error = new Error(`No nav with id ${navigation} is found.`);
    error.status = 404;
    throw error;
  }
  this.navigation = this.navigation.splice(idxNav, 1);
  return this.save();
};

COURSE.methods.addPricing = function addPricing(pricing) {
  this.pricingPlans.push(pricing);
  return this.save();
};

COURSE.methods.removePricing = async function removePricing(pricing) {
  const _pricing = this.pricingPlans.id(pricing);
  if (!_pricing) {
    const error = new Error(`Pricing plan with id ${pricing} is not found in Course model.`);
    error.status = 404;
    throw error;
  }
  _pricing.remove();
  return this.save();
};

COURSE.methods.addPage = function addPage(page) {
  this.pages.push(page);
  return this.save();
};

const Course = mongoose.model('course', COURSE);

module.exports = Course;
