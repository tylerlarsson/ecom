const mongoose = require('mongoose');
const Course = require('./course');
const { ObjectId } = mongoose.Schema.Types;
const { DEFAULT_OPTIONS } = require('./common');

const PAGE_STATUS = {
  ACTIVE: 'published',
  DRAFT: 'draft'
};

const CONTENT_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
  TEXT: 'text'
};

const CONTENT = new mongoose.Schema({
  index: { type: Number, required: true },
  type: { type: String, enum: Object.values(CONTENT_TYPES), default: CONTENT_TYPES.TEXT },
  content: { type: String, required: true }
});

const PAGE = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    content: [CONTENT],
    url: { type: String, required: true },
    course: { type: ObjectId, ref: 'course', required: true },
    status: { type: String, enum: Object.values(PAGE_STATUS), default: PAGE_STATUS.DRAFT },
    showFooter: { type: Boolean, default: false },
    showNavigation: { type: Boolean, default: false },
    updatedAt: Date,
    createdAt: Date
  },
  DEFAULT_OPTIONS
);

PAGE.statics.editPage = async args => {
  const { id, ...rest } = args;
  const page = await Page.findById(args.id);

  if (!page) {
    const error = new Error(`No course with id ${args.id} is found.`);
    error.status = 404;
    throw error;
  } else {
    Object.assign(page, { updatedAt: new Date(), ...rest });
  }
  return page.save();
};

PAGE.statics.createPage = async args => {
  const { course } = args;
  const _course = await Course.findById(course);
  if (!_course) {
    const error = new Error(`No course with id ${course} is found.`);
    error.status = 404;
    throw error;
  } else {
    const page = new Page({ createdAt: new Date(), ...args });
    const _page = await page.save();
    await _course.addPage(_page._id);
    return _page;
  }
};

PAGE.methods.addContent = function addContent(args) {
  this.content.push(args);
  return this.save();
};

PAGE.methods.removeContent = function removeContent(content) {
  const _content = this.content.id(content);
  if (!_content) {
    const error = new Error(`Content with id ${content} is not found in Page model.`);
    error.status = 404;
    throw error;
  }
  _content.remove();
  return this.save();
};

PAGE.methods.editContent = function editContent(args) {
  const { id, ...rest } = args;
  const content = this.content.id(id);
  if (!content) {
    const error = new Error(`Content with id ${content} is not found in Page model.`);
    error.status = 404;
    throw error;
  } else {
    Object.assign(content, { ...rest });
    return this.save();
  }
};

const Page = mongoose.model('page', PAGE);

module.exports = Page;
